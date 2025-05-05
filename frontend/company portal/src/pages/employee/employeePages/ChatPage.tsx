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
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useChat } from "../../../context/chatContext";
import { addGroupMembersService, addGroupService, getEmployeesForChatService, getGroupMessagesService, getPrivateMessagesService } from "../../../services/user/userService";
import Sidebar from "../../../components/SidebarComponent";
import { Header } from "../../../components/HeaderComponent";
import GroupFormModal from "../modals/GroupModal";
import { ChatUser, IGroup } from "../../../utils/Interfaces/interfaces";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { useConfirmModal } from "../../../components/useConfirm";
import { AddMembersModal } from "../modals/AddMembersModal";



interface CurrentUser {
    _id: string;
    email: string;
    role: string;
    profilePic: string;
    fullName: string;
}

interface Sender {
    _id: string;
    fullName: string;
    email: string;
}

interface ChatMessage {
    _id: string;
    content: string;
    createdAt: string | undefined;
    deliveredTo: string[];
    readBy: string[];
    recipient?: string;
    replyTo?: string;
    roomId?: string;
    sender: string | Sender;
    __v: number;
}

const ChatPage = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<"individual" | "group">("individual");
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<{ roomId: string; projectName: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [groupChatModal, setGroupChatModal] = useState(false);
    const [scroll, setScroll] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setJustSentMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);
    const currentUser: CurrentUser = JSON.parse(localStorage.getItem("employeeSession") || "{}");
    const { messages, projectRooms, sendMessage, joinRoom, deleteMessage, setMessages, onlineUsers, deleteGroup, leaveGroup } = useChat();
    const { ConfirmModalComponent, confirm } = useConfirmModal();

    const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);
    const [selectedGroupForAddMembers, setSelectedGroupForAddMembers] = useState<{
        roomId: string;
        projectName: string;
    } | null>(null);

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

    useEffect(() => {
        projectRooms.forEach((room) => joinRoom(room.roomId, "group"));
    }, [projectRooms, joinRoom]);

    useEffect(() => {
        if (activeTab === "individual" && selectedUser) {
            const fetchMessages = async () => {
                const res = await getPrivateMessagesService(currentUser._id, selectedUser._id);
                const transformedMessages = res.messages.map((msg: ChatMessage) => ({
                    ...msg,
                    sender: typeof msg.sender === "string" ? { _id: msg.sender, fullName: "", email: "" } : msg.sender,
                }));
                setMessages(transformedMessages);
            };
            fetchMessages();
            joinRoom(selectedUser._id, "individual");
        } else if (activeTab === "group" && selectedRoom) {
            const fetchMessages = async () => {
                const res = await getGroupMessagesService(selectedRoom.roomId);
                const transformedMessages = res.messages.map((msg: ChatMessage) => ({
                    ...msg,
                    sender: typeof msg.sender === "string" ? { _id: msg.sender, fullName: "", email: "" } : msg.sender,
                }));
                setMessages(transformedMessages);
            };
            fetchMessages();
            joinRoom(selectedRoom.roomId, "group");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, selectedRoom, selectedUser]);

    useEffect(() => {
        console.log("Online users updated in ChatPage:", onlineUsers);
    }, [onlineUsers]);

    const filteredUsers = searchQuery
        ? users.filter((user) =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : users;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                content: newMessage,
                sender: {
                    _id: currentUser._id,
                    fullName: currentUser.fullName,
                    email: currentUser.email,
                },
                recipient: activeTab === "individual" ? selectedUser?._id : undefined,
                roomId: activeTab === "group" && selectedRoom ? selectedRoom.roomId : undefined,
                replyTo: undefined,
                chatType: activeTab,
            };
            setScroll(!scroll);
            sendMessage(message);
            setNewMessage("");
            setJustSentMessage(true);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleAddMembers = async (userIds: string[]) => {
        try {
            const response = await addGroupMembersService(
                selectedGroupForAddMembers?.roomId || "",
                userIds
            );
            enqueueSnackbar(response.message, { variant: "success" });
        } catch (error) {
            enqueueSnackbar(
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Failed to add members",
                { variant: "error" }
            );
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        deleteMessage(
            messageId,
            activeTab,
            activeTab === "individual" ? selectedUser?._id : undefined,
            activeTab === "group" ? (selectedRoom?.roomId ?? undefined) : undefined
        );
        setMessages(messages.filter((msg) => msg._id !== messageId));
    };

    const handleGroupAdd = async (data: IGroup) => {
        try {
            const response = await addGroupService(data);
            enqueueSnackbar(response.message, { variant: "success" })

        } catch (error) {
            console.log(error);
            enqueueSnackbar((error instanceof AxiosError) ? error.response?.data.message : "error in adding chat", { variant: "error" })
        }
    }



    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar role="employee" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 pb-2">
                    <Header heading="Chat Dashboard" role="employee" />
                </div>
                <div className="px-6 pb-6 flex-1 overflow-hidden">
                    <Card className="h-full flex flex-col overflow-hidden">
                        <CardHeader className="p-4 border-b">
                            <div className="flex justify-between items-center w-full">
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(value: string) => {
                                        if (value === "individual" || value === "group") {
                                            setActiveTab(value);
                                        }
                                    }}
                                    className="w-auto"
                                >
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
                            {activeTab === "group" && (
                                <div className="mt-4">
                                    <Button onClick={() => setGroupChatModal(true)} variant="default">
                                        Create Group
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-1/3 border-r overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {activeTab === "individual" &&
                                            filteredUsers.map((user) => {
                                                return (
                                                    <div
                                                        key={user._id}
                                                        className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md ${selectedUser?._id === user._id ? "bg-gray-100" : ""
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setSelectedRoom(null);
                                                        }}
                                                    >
                                                        <div className="relative mr-3">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={user.profilePic} alt={user.fullName} />
                                                                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {onlineUsers.includes(user._id) ? (
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                                            ) : (
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-gray-800 truncate">{user.fullName}</span>
                                                                {user.role !== "developer" && (
                                                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{user.role}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        {activeTab === "group" &&
                                            projectRooms.map((room) => (
                                                <div
                                                    key={room.roomId}
                                                    className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md ${selectedRoom?.roomId === room.roomId ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    <div
                                                        className="flex-1 min-w-0"
                                                        onClick={() => {
                                                            setSelectedRoom({
                                                                projectName: room.projectName,
                                                                roomId: room.roomId,
                                                            });
                                                            setSelectedUser(null);
                                                        }}
                                                    >
                                                        <span className="font-medium text-gray-800 truncate">
                                                            {room.projectName} Group Chat
                                                        </span>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="p-1 text-gray-500 hover:bg-transparent hover:text-gray-700 focus:outline-none"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="bg-white border border-gray-200 shadow-md"
                                                        >
                                                            {room.createdBy === currentUser._id ? (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            confirm({
                                                                                title: "Delete Group",
                                                                                message: "Are you sure you want to delete this Group?",
                                                                                onConfirm: () => {
                                                                                    deleteGroup(room.roomId);
                                                                                }
                                                                            });
                                                                        }}
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        Delete Group
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedGroupForAddMembers(room);
                                                                            setAddMembersModalOpen(true);
                                                                        }}
                                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                    >
                                                                        Add Members
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )
                                                                :
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        confirm({
                                                                            title: "Leave Group",
                                                                            message: "Are you sure you want to leave this Group?",
                                                                            onConfirm: () => {
                                                                                leaveGroup(room.roomId);
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="text-yellow-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    Leave Group
                                                                </DropdownMenuItem>
                                                            }

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="w-2/3 flex flex-col overflow-hidden">
                                {(selectedUser || selectedRoom) ? (
                                    <>
                                        <div className="flex items-center p-4 border-b">
                                            {selectedUser ? (
                                                <>
                                                    <Avatar className="h-10 w-10 mr-3">
                                                        <AvatarImage src={selectedUser.profilePic} alt={selectedUser.fullName} />
                                                        <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h2 className="font-semibold text-gray-800">{selectedUser.fullName}</h2>
                                                    </div>
                                                </>
                                            ) : (
                                                <h2 className="font-semibold text-gray-800">{selectedRoom?.projectName} Project Chat</h2>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                                <div ref={scrollContentRef}>
                                                    {(() => {
                                                        const filteredMessages = messages.filter((msg) => {
                                                            const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender._id;
                                                            const isMatch =
                                                                (activeTab === "individual" &&
                                                                    ((senderId === selectedUser?._id && msg.recipient === currentUser._id) ||
                                                                        (msg.recipient === selectedUser?._id && senderId === currentUser._id))) ||
                                                                (activeTab === "group" && msg.roomId === selectedRoom?.roomId);
                                                            console.log("Message:", msg, "isMatch:", isMatch);
                                                            return isMatch;
                                                        });

                                                        // Deduplicate messages by their _id
                                                        const seenMessageIds = new Set<string>();
                                                        const uniqueMessages = filteredMessages.filter((msg) => {
                                                            if (seenMessageIds.has(msg._id)) {
                                                                return false;
                                                            }
                                                            seenMessageIds.add(msg._id);
                                                            return true;
                                                        });

                                                        if (uniqueMessages.length === 0) {
                                                            return (
                                                                <div className="text-center text-gray-400 text-sm mt-10">
                                                                    No messages yet.
                                                                </div>
                                                            );
                                                        }

                                                        return uniqueMessages.map((message) => (
                                                            <div
                                                                key={message._id}
                                                                className={`flex relative ${(typeof message.sender === "string" ? message.sender : message.sender._id) === currentUser._id
                                                                    ? "justify-end"
                                                                    : "justify-start"
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`p-3 rounded-lg shadow-sm max-w-[80%] flex items-start gap-2 ${(typeof message.sender === "string" ? message.sender : message.sender._id) === currentUser._id
                                                                        ? "bg-blue-600 text-white rounded-tr-none"
                                                                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                                                                        }`}
                                                                >
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-medium mb-1">
                                                                            {message.sender.fullName}
                                                                        </p>
                                                                        <p className="break-words text-sm">{message.content}</p>
                                                                        <span
                                                                            className={`text-xs block mt-1 ${(typeof message.sender === "string" ? message.sender : message.sender._id) ===
                                                                                currentUser._id
                                                                                ? "text-blue-200"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {new Date(message.createdAt || "").toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    {(typeof message.sender === "string" ? message.sender : message.sender._id) === currentUser._id && (
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
                                                        ));
                                                    })()}
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
            <GroupFormModal isOpen={groupChatModal} onClose={() => setGroupChatModal(false)} onSubmit={handleGroupAdd} />
            <ConfirmModalComponent />
            <AddMembersModal
                isOpen={addMembersModalOpen}
                onClose={() => setAddMembersModalOpen(false)}
                groupId={selectedGroupForAddMembers?.roomId || ""}
                allUsers={users ?? []}
                onAddMembers={handleAddMembers}
            />
        </div>
    );
};

export default ChatPage;