import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";

interface Message {
    _id: string;
    content: string;
    sender: string;
    recipient?: string;
    roomId?: string;
    replyTo?: string;
    createdAt?: string;
}


interface ChatContextType {
    messages: Message[];
    sendMessage: (message: Omit<Message, "_id">) => void;
    joinRoom: (roomId: string) => void;
    deleteMessage: (messageId: string, chatId: string) => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = (message: Omit<Message, "_id">) => {
        socket.emit("send_message", message);
    };

    const joinRoom = (roomId: string) => {
        socket.emit("join", roomId);
    };

    const deleteMessage = (messageId: string, chatId: string) => {
        socket.emit("delete_message", { messageId, chatId });
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("employeeSession") || "{}");
        if (user?._id) {
            socket.emit("register_user", user._id);
        }

        socket.on("message_deleted", ({ messageId }) => {
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        });

        socket.on("receive_message", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => {
            socket.off("message_deleted");
            socket.off("receive_message");
        };
    }, []);

    return (
        <ChatContext.Provider value={{ messages, sendMessage, joinRoom, setMessages, deleteMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};