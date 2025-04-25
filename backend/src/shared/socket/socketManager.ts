import { Server as IOServer, Socket } from "socket.io";
import { injectable, inject } from "tsyringe";
import { IMessageRepository } from "../../entities/repositoryInterfaces/IMessage.respository";

@injectable()
export class SocketManager {
  private io!: IOServer;
  private userSocketMap: Map<string, string> = new Map();

  constructor(
    @inject("IMessageRepository") private messageRepo: IMessageRepository
  ) { }

  public initialize(io: IOServer): void {
    this.io = io;
    this.handleConnections();
  }

  private handleConnections(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("🔌 New client connected:", socket.id);

      socket.on("register_user", (userId: string) => {
        this.userSocketMap.set(userId, socket.id);
        console.log(`👤 User ${userId} registered with socket ID ${socket.id}`);
      });

      socket.on("join", (roomId: string) => {
        socket.join(roomId);
        console.log(`📥 ${socket.id} joined room ${roomId}`);
      });

      socket.on("send_message", async (data) => {
        const {
          content,
          sender,
          recipient,
          roomId,
          replyTo,
        } = data;

        try {
          const savedMessage = await this.messageRepo.createMessage({
            content,
            sender,
            recipient,
            roomId,
            replyTo,
          });

          if (recipient) {
            const recipientSocketId = this.userSocketMap.get(recipient);
            if (recipientSocketId) {
              this.io.to(recipientSocketId).emit("receive_message", savedMessage);
              socket.to(recipientSocketId).emit("delivered", {
                messageId: savedMessage._id,
                to: recipient,
              });
            }
          }

          if (roomId) {
            this.io.to(roomId).emit("receive_message", savedMessage);
          }

          socket.emit("message_sent", savedMessage);
          socket.emit("receive_message", savedMessage);
        } catch (error) {
          console.error("❌ Message saving failed:", error);
          socket.emit("error_message", "Failed to send message.");
        }
      });

      socket.on("delete_message", async ({ messageId, chatId }) => {
        await this.messageRepo.deleteMessage(messageId);

        const recipientSocketId = this.userSocketMap.get(chatId);
        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit("message_deleted", { messageId });
        }

        socket.emit("message_deleted", { messageId });
      })

      socket.on("disconnect", () => {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === socket.id) {
            this.userSocketMap.delete(userId);
            console.log(`❌ Disconnected user ${userId}`);
            break;
          }
        }
      });
    });
  }
}
