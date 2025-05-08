import { useEffect, useState } from "react";
import { Bell, MessageCircle, Users } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useChat } from "../context/chatContext";

export const NotificationDropdown = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        fetchNotifications,
        setNotifications
    } = useChat();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message': return <MessageCircle className="h-4 w-4" />;
            case 'group_invite': return <Users className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
        }
    }

    const handleNotificationClick = (notificationId: string) => {
        try {
            markAsRead([notificationId]);
            // Add navigation logic here if needed
        } catch (error) {
            console.log(error);
        }
    };

    const handleMarkAllAsRead = () => {
        try {
            const unreadIds = notifications
                .filter(n => !n.read && !n._id.startsWith('temp-'))
                .map(n => n._id);

            if (unreadIds.length > 0) {
                markAsRead(unreadIds);
            }

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (notification._id.startsWith('temp-')) {
            const timestamp = parseInt(notification._id.split('-')[1]);
            return Date.now() - timestamp < 600000; // 10 minutes
        }
        return true;
    });

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-0 max-h-[400px] flex flex-col"
                align="end"
                sideOffset={10}
            >
                <div className="p-3 border-b flex justify-between items-center shrink-0">
                    <h4 className="font-semibold">Notifications</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Mark all as read
                    </Button>
                </div>
                <ScrollArea className="flex-1 overflow-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                                        !notification.read && "bg-muted/30",
                                        notification._id.startsWith('temp-') && "opacity-80"
                                    )}
                                    onClick={() => handleNotificationClick(notification._id)}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className={cn(
                                                    "text-sm",
                                                    !notification.read && "font-semibold"
                                                )}>
                                                    {notification.content}
                                                </p>
                                                {!notification.read && !notification._id.startsWith('temp-') && (
                                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(notification.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {notification._id.startsWith('temp-') && (
                                                    <span className="text-xs text-muted-foreground">Live</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
