import { Server as IOServer, Socket } from "socket.io";
import { injectable, inject } from "tsyringe";
import { IMessageRepository } from "../../entities/repositoryInterfaces/IMessage.respository";
import cookie from "cookie";
import { IJwtService } from "../../entities/services/jwt.interface";
import { IGroupRepository } from "../../entities/repositoryInterfaces/IGroup.repository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/INotification.repository";

@injectable()
export class SocketManager {
  private io!: IOServer;
  private userSocketMap: Map<string, string> = new Map();

  constructor(
    @inject("IMessageRepository") private messageRepo: IMessageRepository,
    @inject("IGroupRepository") private groupRepo: IGroupRepository,
    @inject("IJwtService") private jwtService: IJwtService,
    @inject("INotificationRepository") private notificationRepo: INotificationRepository,
  ) { }

  public initialize(io: IOServer): void {
    this.io = io;

    this.io.use(async (socket, next) => {
      try {
        const rawCookie = socket.handshake.headers.cookie;

        if (!rawCookie) {
          return next(new Error("Authentication failed: No cookies sent."));
        }

        const parsedCookies = cookie.parse(rawCookie);
        const token = parsedCookies.access_token;

        if (!token) {
          return next(new Error("Authentication failed: Token not found in cookies."));
        }

        const decoded = this.jwtService.verifyAccessToken(token);
        (socket as any).user = decoded;

        next();
      } catch (error) {
        console.error("❌ Socket auth failed:", error);
        return next(new Error("Authentication failed."));
      }
    });

    this.handleConnections();
  }

  private async handleConnections(): Promise<void> {
    this.io.on("connection", (socket: Socket) => {
      const user = (socket as any).user;
      console.log("✅ Authenticated user connected:", user?.id);
      console.log("🔌 New client connected:", socket.id);

      socket.on("register_user", async (userId: string) => {
        this.userSocketMap.set(userId, socket.id);
        console.log(`👤 User ${userId} registered with socket ID ${socket.id}`);

        this.io.emit("online_users", Array.from(this.userSocketMap.keys()));

        socket.broadcast.emit("user_online", { userId });

        try {
          const groups = await this.groupRepo.getGroupsByUser(userId);
          const groupRooms = groups.map((group: any) => ({
            groupId: group._id.toString(),
            roomId: group._id.toString(),
            groupName: group.name,
            groupCreatedBy: group.createdBy,
          }));

          // Join all group rooms
          groupRooms.forEach((room) => {
            socket.join(room.roomId);
            console.log(`📥 ${socket.id} (User ${userId}) joined group ${room.roomId}`);
          });

          // Emit ONLY group rooms to frontend
          socket.emit("group_rooms", groupRooms);
        } catch (error) {
          console.error("❌ Failed to fetch projects for user:", error);
          socket.emit("error", "Failed to load project rooms.");
        }
      });

      socket.on("group_created", (group) => {
        console.log("geoup created brooo")
        const { _id, name, members, createedBy } = group;

        const groupData = {
          _id,
          name,
          members,
          createedBy
        };

        members.forEach((memberId: string) => {
          const socketId = this.userSocketMap.get(memberId);
          if (socketId) {
            this.io.to(socketId).emit("group_created", groupData);
            this.io.sockets.sockets.get(socketId)?.join(_id);
          }
        });
      });

      socket.on("delete_group", async ({ roomId }) => {
        try {
          await this.groupRepo.deleteGroup(roomId);

          this.io.to(roomId).emit("group_deleted", { roomId });

          const sockets = await this.io.in(roomId).fetchSockets();
          sockets.forEach(socket => {
            socket.leave(roomId);
          });
        } catch (error) {
          console.error("Group deletion failed:", error);
        }
      });

      this.handleNotificationEvents(socket)

      socket.on("leave_group", async ({ roomId }) => {
        try {
          const userId = (socket as any).user?.id;

          await this.groupRepo.removeMember(roomId, userId);

          socket.leave(roomId);

          this.io.to(roomId).emit("member_left", {
            roomId,
            userId,
            userName: (socket as any).user?.name
          });

          socket.emit("group_left", { roomId });

        } catch (error) {
          console.error("Failed to leave group:", error);
        }
      });


      socket.on("join", (roomId: string) => {
        socket.join(roomId);
        console.log(`📥 ${socket.id} joined room ${roomId}`);
      });

      socket.on("send_message", async (data) => {
        const { content, sender, recipient, roomId, media } = data;
        try {
          const savedMessage = await this.messageRepo.createMessage({
            content,
            sender: sender._id,
            recipient,
            roomId,
            media,
          });

          if (recipient) {

            await this.notificationRepo.createNotification({
              recipient,
              sender: sender._id,
              type: "message",
              content: `New Message from ${sender.fullName}`,
              read: false,
            })


            const recipientSocketId = this.userSocketMap.get(recipient);
            if (recipientSocketId) {
              this.io.to(recipientSocketId).emit("new_notification", {
                content: `New message from ${sender.fullName}`,
                _id: Date.now().toString(),
                read: false,
                createdAt: new Date()
              })


              this.io.to(recipientSocketId).emit("receive_message", savedMessage);
              socket.to(recipientSocketId).emit("delivered", {
                messageId: savedMessage._id,
                to: recipient,
              });
            }
          }

          if (roomId) {
            this.io.to(roomId).emit("receive_message", {
              ...savedMessage,
              media: media ? { url: media.url, type: media.type } : null
            });
          }

          socket.emit("message_sent", savedMessage);
          socket.emit("receive_message", savedMessage);
        } catch (error) {
          console.error("❌ Message saving failed:", error);
          socket.emit("error_message", "Failed to send message.");
        }
      });

      socket.on("delete_message", async ({ messageId, chatId, roomId }) => {
        try {
          await this.messageRepo.deleteMessage(messageId);

          if (chatId) {
            const recipientSocketId = this.userSocketMap.get(chatId);
            if (recipientSocketId) {
              this.io.to(recipientSocketId).emit("message_deleted", { messageId });
            }
          }

          if (roomId) {
            this.io.to(roomId).emit("message_deleted", { messageId });
          }

          socket.emit("message_deleted", { messageId });
        } catch (error) {
          console.error("❌ Message deletion failed:", error);
          socket.emit("error_message", "Failed to delete message.");
        }
      });

      socket.on('members_added', ({ groupId, newMembers }) => {

        console.log('New members added:', newMembers);
      });

      socket.on('added_to_group', ({ groupId, groupName }) => {
        const userId = (socket as any).user?.id;

        console.log(`You've been added to group: ${groupName}`);

        this.notificationRepo.createNotification({
          recipient: userId,
          type: 'group_invite',
          content: `You were added to group "${groupName}"`,
          read: false
        });

        socket.emit('new_notification', {
          content: `You were added to group "${groupName}"`,
          _id: Date.now().toString(),
          read: false,
          createdAt: new Date()
        });

        socket.emit('join', groupId);
      });

      socket.on("disconnect", () => {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === socket.id) {
            this.userSocketMap.delete(userId);
            console.log(`❌ Disconnected user ${userId}`);

            console.log("user gone offline", userId);

            this.io.emit("online_users", Array.from(this.userSocketMap.keys()));
            this.io.emit("user_offline", userId);
            break;
          }
        }
      });
    });
  }

  public emitGroupCreated(group: any) {
    console.log("Emitting group_created event");
    this.io.emit("group_created", {
      _id: group._id,
      name: group.name,
      members: group.members,
      createdBy: group.createdBy
    });

    group.members.forEach(async (memberId: string) => {
      if (memberId !== group.createdBy) {
        await this.notificationRepo.createNotification({
          recipient: memberId,
          sender: group.createdBy,
          type: 'group_invite',
          content: `You were added to group "${group.name}"`,
        });
      }
    });
  }

  public emitMembersAdded(groupId: string, newMembers: string[], allMembers: string[]) {
    if (!this.io) throw new Error("Socket.IO not initialized");

    this.io.to(groupId).emit('members_added', {
      groupId,
      newMembers,
      allMembers
    });

    newMembers.forEach(userId => {
      const socketId = this.userSocketMap.get(userId);
      if (socketId) {
        this.io.to(socketId).emit('added_to_group', {
          groupId,
          groupName: ""
        });
      }
    });

    newMembers.forEach(userId => {
      this.notificationRepo.createNotification({
        recipient: userId,
        type: 'group_update',
        content: `You were added to a group`,
      });
    });
  }

  private handleNotificationEvents(socket: Socket) {
    socket.on("get_notifications", async (employeeId: string) => {
      const notification = await this.notificationRepo.getUnreadNotifications(employeeId);
      socket.emit("notification_list", notification);
    });

    socket.on("mark_as_read", async (notificationIds: string[]) => {
      await this.notificationRepo.markAsRead(notificationIds);
      socket.emit("notification_marked_read", notificationIds);
    })
  }

  public async sendRealTimeNotification(userId: string, content: string) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("new_notification", {
        _id: `temp-${Date.now()}`,
        content,
        read: false,
        createdAt: new Date()
      });
    }
  }
  public async sendPersistentNotification(notificationData: {
    recipient: string;
    sender?: string;
    type: "message" | "group_invite" | "mention" | "reaction" | "group_update";
    content: string;
  }) {
    const notification = await this.notificationRepo.createNotification(notificationData);
    this.sendRealTimeNotification(notification.recipient.toString(), notification.content);
  }

  // public sendDirectMessage(data: {
  //   recipient: string;
  //   message: any;
  // }) {
  //   const socketId = this.userSocketMap.get(data.recipient);
  //   if (socketId) {
  //     this.io.to(socketId).emit('receive_message', {
  //       ...data.message,
  //       isMedia: true
  //     });
  //   }
  // }

  // public sendGroupMessage(data: {
  //   roomId: string;
  //   message: any;
  // }) {
  //   this.io.to(data.roomId).emit('receive_message', {
  //     ...data.message,
  //     isMedia: true
  //   });
  // }
}

