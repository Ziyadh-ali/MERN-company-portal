export interface IGroup {
    _id ?: string;
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
    _id : string;
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