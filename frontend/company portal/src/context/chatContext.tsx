/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { enqueueSnackbar } from "notistack";
import { Message, Notification } from "../utils/Interfaces/interfaces";



type ProjectRoom = {
    projectId: string;
    roomId: string;
    projectName: string;
    createdBy?: string;
}

interface ChatContextType {
    messages: Message[];
    projectRooms: ProjectRoom[];
    sendMessage: (message: Omit<Message, "_id"> & { chatType: "individual" | "group" }) => void;
    joinRoom: (roomId: string, chatType: "individual" | "group") => void;
    deleteMessage: (messageId: string, chatType: "individual" | "group", chatId?: string, roomId?: string) => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setProjectRooms: React.Dispatch<React.SetStateAction<ProjectRoom[]>>;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    onlineUsers: string[];
    setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
    deleteGroup: (roomId: string) => void;
    leaveGroup: (roomId: string) => void;
    isGroupAdmin: (roomId: string) => boolean;
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => void;
    markAsRead: (notificationIds: string[]) => void;
    clearNotifications: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [projectRooms, setProjectRooms] = useState<ProjectRoom[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const sendMessage = (message: Omit<Message, "_id"> & { chatType: "individual" | "group" }) => {
        const { content, sender, recipient, roomId, chatType , media } = message;
        const payload = {
            content,
            sender,
            recipient: chatType === "individual" ? recipient : undefined,
            roomId: chatType === "group" ? roomId : undefined,
            media,
        };
        socket.emit("send_message", payload);
    };

    const joinRoom = (roomId: string, chatType: "individual" | "group") => {
        socket.emit("join", roomId);
        console.log(`Joined ${chatType} room: ${roomId}`);
    };

    const deleteMessage = (messageId: string, chatType: "individual" | "group", chatId?: string, roomId?: string) => {
        socket.emit("delete_message", {
            messageId,
            chatId: chatType === "individual" ? chatId : undefined,
            roomId: chatType === "group" ? roomId : undefined,
        });
    };

    const deleteGroup = (roomId: string) => {
        socket.emit("delete_group", { roomId });
    };

    const leaveGroup = (roomId: string) => {
        socket.emit("leave_group", { roomId });
    };

    const isGroupAdmin = (roomId: string) => {
        const user = JSON.parse(localStorage.getItem("employeeSession") || "{}");
        const room = projectRooms.find(r => r.roomId === roomId);
        return room?.createdBy === user._id;
    };

    const fetchNotifications = () => {
        const user = JSON.parse(localStorage.getItem("employeeSession") || "{}");
        if (user?._id) {
            socket.emit("get_notifications", user._id);
        }
    };

    const markAsRead = (notificationIds: string[]) => {
        socket.emit("mark_as_read", notificationIds);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("employeeSession") || "{}");
        if (user?._id) {
            socket.emit("register_user", user._id);
        }

        socket.on("online_users", (users: string[]) => {
            console.log("🔄 Updated online users:", users);
            setOnlineUsers(users);
        });

        socket.on("group_rooms", (rooms: Array<{
            groupId: string;
            roomId: string;
            groupName: string;
            groupCreatedBy: string;
        }>) => {
            console.log("Group rooms received:", rooms);

            // Store all groups (no project rooms mixed in)
            setProjectRooms(rooms.map(room => ({
                projectId: room.groupId,
                roomId: room.roomId,
                projectName: room.groupName,
                createdBy: room.groupCreatedBy,
            })));
        });

        socket.on("user_online", (userId: string) => {
            setOnlineUsers(prev => [...prev, userId]);
        });

        socket.on("user_offline", (userId: string) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        socket.on("group_created", (group: { _id: string; name: string, createdBy: string }) => {
            console.log("New group created:", group);

            setProjectRooms(prev => [
                ...prev,
                {
                    projectId: group._id,
                    roomId: group._id,
                    projectName: group.name,
                    createdBy: group.createdBy,
                }
            ]);

            joinRoom(group._id, "group");
        });

        socket.on("receive_message", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("message_deleted", ({ messageId }: { messageId: string }) => {
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        });

        socket.on("group_deleted", ({ roomId }) => {
            setProjectRooms(prev => prev.filter(room => room.roomId !== roomId));
        });

        socket.on("group_left", ({ roomId }) => {
            setProjectRooms(prev => prev.filter(room => room.roomId !== roomId));
        });

        socket.on("member_left", ({ userName }) => {
            enqueueSnackbar(`${userName} left the group`, { variant: "info" });

        });

        socket.on('members_added', ({ groupId, newMembers }) => {
            console.log('New members added to group', groupId, newMembers);
        });

        socket.on('added_to_group', ({ groupId, groupName }) => {
            setProjectRooms(prev => [...prev, {
                projectId: groupId,
                roomId: groupId,
                projectName: groupName,
            }]);
            joinRoom(groupId, 'group');
        });

        const handleReconnect = () => {
            const user = JSON.parse(localStorage.getItem("employeeSession") || "{}");
            if (user?._id) {
                socket.emit("register_user", user._id);
            }
        };

        socket.on("notification_list", (notifications: Notification[]) => {
            setNotifications(notifications);
            setUnreadCount(notifications.filter(n => !n.read).length);
        });

        socket.on('new_notification', (notification) => {
            if (notification._id.startsWith('temp-')) {
                setNotifications(prev => [{
                    ...notification,
                    isTemp: true
                }, ...prev]);

                setUnreadCount(prev => prev + 1);
            } else {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                fetchNotifications();
            }
        });

        socket.on("notification_marked_read", (notificationIds: string[]) => {
            setNotifications(prev =>
                prev.map(n =>
                    notificationIds.includes(n._id) ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => prev - notificationIds.length);
        });

        socket.on("connect", handleReconnect);

        return () => {
            socket.off("user_online");
            socket.off("user_offline");
            socket.off("online_users");
            socket.off("group_rooms");
            socket.off("group_created");
            socket.off("receive_message");
            socket.off("message_deleted");
            socket.off("group_deleted");
            socket.off("group_left");
            socket.off("member_left");
            socket.off("added_to_group");
            socket.off("members_added");
            socket.off("notification_list");
            socket.off("new_notification");
            socket.off("notification_marked_read");
            socket.off("connect", handleReconnect);
        };
    }, []);

    return (
        <ChatContext.Provider
            value={{
                messages,
                projectRooms,
                sendMessage,
                joinRoom,
                deleteMessage,
                setMessages,
                setProjectRooms,
                onlineUsers,
                setOnlineUsers,
                deleteGroup,
                leaveGroup,
                isGroupAdmin,
                notifications,
                unreadCount,
                fetchNotifications,
                markAsRead,
                clearNotifications,
                setNotifications
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};