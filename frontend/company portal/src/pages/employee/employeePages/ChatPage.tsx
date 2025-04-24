import { useState, useEffect, useRef } from "react";
import { Card, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Send, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import EmployeeSidebar from "../../../components/employeeComponents/employeeSidebar";
import { EmployeeHeader } from "../../../components/employeeComponents/employeeHeader";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useChat } from "../../../context/chatContext";
import { getEmployeesForChatService, getPrivateMessagesService } from "../../../services/user/userService";

interface ChatUser {
    _id: string;
    fullName: string;
    role: string;
    profilePic: string;
}

interface CurrentUser {
    _id: string;
    email: string;
    role: string;
    profilePic: string;
    fullName: string;
}

export interface ChatMessage {
    _id: string;
    content: string;
    createdAt: string;
    deliveredTo: string[];
    readBy: string[];
    recipient: string | null;
    replyTo: string | null;
    roomId: string | null;
    sender: {
        _id: string;
        fullName: string;
        email: string;
    };
    __v: number;
}

const ChatPage = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeTab, setActiveTab] = useState("individual");
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const currentUser: CurrentUser = JSON.parse(localStorage.getItem("employeeSession") || "{}");

    const { messages, setMessages, sendMessage, joinRoom , deleteMessage } = useChat();

    useEffect(() => {
        async function fetchEmployees() {
            const response = await getEmployeesForChatService();
            const filteredEmployees = response.employees.filter(
                (emp: ChatUser) => emp._id !== currentUser._id
            );
            setUsers(filteredEmployees);
        }
        fetchEmployees();
    }, [currentUser._id]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        setSelectedUser(users[0]);
    }, [users]);

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                if (selectedUser) {
                    const res = await getPrivateMessagesService(currentUser._id, selectedUser._id);
                    console.log(res.messages);
                    setMessages(res.messages);
                }
            };

            fetchMessages();
            joinRoom(selectedUser._id);
        }
    }, [selectedUser]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const filteredUsers = searchQuery
        ? users.filter((user) =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : users;

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            const message = {
                content: newMessage,
                sender: currentUser._id,
                recipient: selectedUser._id,
                timestamp: new Date().toISOString(),
            };
            sendMessage(message);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleDeleteMessage = (messageId: string) => {

        deleteMessage(messageId , selectedUser?._id ? selectedUser?._id : "")

        setMessages(messages.filter((msg) => msg._id !== messageId));
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <EmployeeSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 pb-2">
                    <EmployeeHeader heading="Chat Dashboard" />
                </div>
                <div className="px-6 pb-6 flex-1 overflow-hidden">
                    <Card className="h-full flex flex-col overflow-hidden">
                        <CardHeader className="p-4 border-b">
                            <div className="flex justify-between items-center w-full">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                                    <TabsList>
                                        <TabsTrigger value="individual">Individual</TabsTrigger>
                                        <TabsTrigger value="group">Group</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Input
                                    type="text"
                                    placeholder="Search chats..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="max-w-xs"
                                />
                            </div>
                        </CardHeader>
                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-1/3 border-r overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {filteredUsers.map((user) => (
                                            <div
                                                key={user._id}
                                                className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md ${selectedUser?._id === user._id ? "bg-gray-100" : ""
                                                    }`}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                                                    <AvatarImage src={user.profilePic} alt={user.fullName} />
                                                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-800 truncate">{user.fullName}</span>
                                                        {user.role !== "developer" ? (
                                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{user.role}</span>
                                                        ) : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className="w-2/3 flex flex-col overflow-hidden">
                                {selectedUser ? (
                                    <>
                                        <div className="flex items-center p-4 border-b">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage src={selectedUser.profilePic} alt={selectedUser.fullName} />
                                                <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="font-semibold text-gray-800">{selectedUser.fullName}</h2>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                                <div className="space-y-4">
                                                    {messages
                                                        .filter(
                                                            (msg) =>
                                                                (msg.sender === selectedUser._id && msg.recipient === currentUser._id) ||
                                                                (msg.recipient === selectedUser._id && msg.sender === currentUser._id)
                                                        )
                                                        .map((message) => (
                                                            <div
                                                                key={message._id}
                                                                className={`flex relative ${message.sender === currentUser._id ? "justify-end" : "justify-start"
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`p-3 rounded-lg shadow-sm max-w-[80%] flex items-start gap-2 ${message.sender === currentUser._id
                                                                            ? "bg-blue-600 text-white rounded-tr-none"
                                                                            : "bg-gray-200 text-gray-800 rounded-tl-none"
                                                                        }`}
                                                                >
                                                                    <div className="flex-1">
                                                                        <p className="break-words text-sm">{message.content}</p>
                                                                        <span
                                                                            className={`text-xs block mt-1 ${message.sender === currentUser._id
                                                                                    ? "text-blue-200"
                                                                                    : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {new Date(message.createdAt ?? "").toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    {message.sender === currentUser._id && (
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="p-1 text-blue-200 hover:bg-transparent hover:text-blue-200 focus:outline-none"
                                                                                >
                                                                                    <MoreVertical className="h-4 w-4" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent
                                                                                align="end"
                                                                                className="bg-white border border-gray-200 shadow-md"
                                                                            >
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleDeleteMessage(message._id)}
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                >
                                                                                    Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        <div className="p-4 border-t relative">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                                                    size="icon"
                                                >
                                                    😊
                                                </Button>

                                                <Input
                                                    type="text"
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={!newMessage.trim()}
                                                    size="icon"
                                                >
                                                    <Send className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            {showEmojiPicker && (
                                                <div className="absolute bottom-[60px] left-4 z-10">
                                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Select a chat to start messaging
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;