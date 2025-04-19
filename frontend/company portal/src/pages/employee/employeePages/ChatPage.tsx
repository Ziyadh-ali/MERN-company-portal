import { useState, useEffect, useRef } from "react";
import { Card, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Send } from "lucide-react";
import EmployeeSidebar from "../../../components/employeeComponents/employeeSidebar";
import { EmployeeHeader } from "../../../components/employeeComponents/employeeHeader";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

interface ChatUser {
    id: string;
    name: string;
    status: "Online" | "Offline";
    latestMessage: string;
    time: string;
    avatar: string;
}

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    sentByMe: boolean;
}

const ChatPage = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeTab, setActiveTab] = useState("individual");
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Mock data (replace with actual API call)
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };
    const mockUsers: ChatUser[] = [
        {
            id: "1",
            name: "Jane Smith",
            status: "Online",
            latestMessage: "Latest project updates...",
            time: "10:30 AM",
            avatar: "https://via.placeholder.com/40",
        },
        {
            id: "2",
            name: "Alex Johnson",
            status: "Offline",
            latestMessage: "Let me know when you're free",
            time: "Yesterday",
            avatar: "https://via.placeholder.com/40",
        },
        {
            id: "3",
            name: "Sarah Parker",
            status: "Online",
            latestMessage: "The design looks great!",
            time: "2:15 PM",
            avatar: "https://via.placeholder.com/40",
        },
    ];

    const mockMessages: Message[] = [
        {
            id: "1",
            sender: "Jane Smith",
            text: "Hi John, how's the progress on the website redesign?",
            time: "10:30 AM",
            sentByMe: false,
        },
        {
            id: "2",
            sender: "John Doe",
            text: "Hi Jane, I've completed the homepage design. Would you like to review it?",
            time: "10:32 AM",
            sentByMe: true,
        },
        {
            id: "3",
            sender: "Jane Smith",
            text: "Yes, please share it with me. I'm particularly interested in seeing how the navigation menu turned out.",
            time: "10:35 AM",
            sentByMe: false,
        },
        {
            id: "4",
            sender: "John Doe",
            text: "I've just sent you the link. The navigation has a dropdown for product categories as you suggested.",
            time: "10:40 AM",
            sentByMe: true,
        },
    ];

    useEffect(() => {
        setSelectedUser(mockUsers[0]);
        setMessages(mockMessages);
    }, []);

    useEffect(() => {
        // Scroll to the latest message whenever messages change
        scrollToBottom();
    }, [messages]);

    // Filter users based on search query
    const filteredUsers = searchQuery
        ? mockUsers.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : mockUsers;

    // Scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            const message: Message = {
                id: Date.now().toString(),
                sender: "John Doe",
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                sentByMe: true,
            };
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage("");
        }
    };

    // Handle key press for sending messages
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <EmployeeSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-2">
                    <EmployeeHeader heading="Chat Dashboard" />
                </div>

                {/* Chat Interface */}
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
                            {/* Chat List */}
                            <div className="w-1/3 border-r overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {filteredUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md ${selectedUser?.id === user.id ? "bg-gray-100" : ""
                                                    }`}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-800 truncate">{user.name}</span>
                                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{user.time}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 truncate">{user.latestMessage}</div>
                                                    <span
                                                        className={`text-xs ${user.status === "Online" ? "text-green-500" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Chat Area */}
                            <div className="w-2/3 flex flex-col overflow-hidden">
                                {selectedUser ? (
                                    <>
                                        {/* Chat Header */}
                                        <div className="flex items-center p-4 border-b">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="font-semibold text-gray-800">{selectedUser.name}</h2>
                                                <span
                                                    className={`text-xs ${selectedUser.status === "Online" ? "text-green-500" : "text-gray-500"
                                                        }`}
                                                >
                                                    {selectedUser.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Messages Area */}
                                        <div className="flex-1 overflow-hidden">
                                            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                                <div className="space-y-4">
                                                    {messages.map((message) => (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${message.sentByMe ? "justify-end" : "justify-start"}`}
                                                        >
                                                            <div
                                                                className={`p-3 rounded-lg ${message.sentByMe
                                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                                                                    } shadow-sm max-w-[80%]`}
                                                            >
                                                                <p className="break-words text-sm">{message.text}</p>
                                                                <span
                                                                    className={`text-xs block mt-1 ${message.sentByMe ? "text-blue-200" : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    {message.time}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        {/* Message Input */}
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