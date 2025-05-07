export interface IGroup {
    _id?: string;
    name: string;
    members: string[];
    createdBy?: string;
}

export interface IAdminAttendance {
    date: Date | null;
    page: number;
    pageSize: number;
}

export interface IQuestion {
    _id: string;
    employeeId: string;
    question: string;
    answer: string;
    isAnswered: boolean;
    answeredBy?: string;
    createdAt: Date;
    answeredAt?: Date;
}

export interface ChatUser {
    _id: string;
    fullName: string;
    role: string;
    profilePic: string;
}

export interface Notification {
    _id: string;
    content: string;
    read: boolean;
    createdAt: Date;
    type: 'message' | 'group_invite' | 'mention' | 'reaction' | 'group_update';
}

export interface Message {
    _id?: string;
    content: string;
    sender: {
        _id: string;
        fullName: string;
        email: string;
    };
    recipient?: string;
    roomId?: string;
    media?: {
        url: string;
        type: 'image' | 'video' | 'document';
        public_id?: string;
    }
    createdAt?: string;
}