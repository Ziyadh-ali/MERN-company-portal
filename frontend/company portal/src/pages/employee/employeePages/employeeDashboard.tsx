import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";

import UserSidebar from "../../../components/userComponents/userSidebar";
import { UserHeader } from "../../../components/userComponents/userHeader";



const EmployeeDashboard = () => {

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <UserSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <UserHeader heading = "Dashboard"/>
                {/* Dashboard Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Attendance</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Clocked in at 9:00 AM
                            </p>
                            <Button className="w-full bg-blue-600 text-white">Clock Out</Button>
                        </CardContent>
                    </Card>

                    {/* Leave Balance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Leave Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-2">
                                <p className="text-sm text-gray-600">Sick Leave</p>
                                <p className="text-sm text-gray-800">5 days</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p className="text-sm text-gray-600">Vacation</p>
                                <p className="text-sm text-gray-800">10 days</p>
                            </div>
                            <Button variant="outline" className="w-full">
                                Apply for Leave
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tasks */}
                    {/* <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm text-gray-600">Tasks</CardTitle>
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                View All
                            </a>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" className="h-4 w-4" />
                                    <p className="text-sm text-gray-600">
                                        Code Review - E-commerce App
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" className="h-4 w-4" />
                                    <p className="text-sm text-gray-600">Update Documentation</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Current Project */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Current Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-gray-800 mb-2">
                                E-commerce App
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs text-gray-600">8 members</span>
                                <span className="text-xs text-gray-600">75% complete</span>
                            </div>
                            <Progress value={75} className="w-full" />
                        </CardContent>
                    </Card>

                    {/* Today's Meetings */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm text-gray-600">Today's Meetings</CardTitle>
                            <Button variant="outline" size="sm">
                                Join
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-gray-800">
                                Daily Stand-up
                            </p>
                            <p className="text-sm text-gray-600">10:00 AM - 10:30 AM</p>
                        </CardContent>
                    </Card>

                    {/* Payroll */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm text-gray-600">Payroll</CardTitle>
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                View Details
                            </a>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">Latest Salary</p>
                            <p className="text-lg font-semibold text-gray-800 mb-2">$4,500</p>
                            <p className="text-sm text-gray-600">Next Payment</p>
                            <p className="text-sm text-gray-800">March 1, 2025</p>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm text-gray-600">Messages</CardTitle>
                            <span className="text-xs text-blue-600">3 new</span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-3 mb-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage
                                        src="https://via.placeholder.com/40"
                                        alt="HR Team"
                                    />
                                    <AvatarFallback>HR</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">HR Team</p>
                                    <p className="text-xs text-gray-600">2 new messages</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                Open Chat
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Help Desk */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Help Desk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-gray-800 mb-2">
                                Recent Ticket
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Ticket #123: Password Reset
                            </p>
                            <p className="text-sm text-orange-600 mb-4">In Progress</p>
                            <Button variant="outline" className="w-full">
                                Get Help
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Section
                <Card className="mt-6">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage
                                    src={user.profilePic || "https://via.placeholder.com/40"}
                                    alt={user.fullName}
                                />
                                <AvatarFallback>
                                    {user.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {user.fullName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {user.role === "developer"
                                        ? "Senior Developer"
                                        : user.role === "hr"
                                            ? "HR Manager"
                                            : "Project Manager"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Visa expires: June 30, 2025
                            </p>
                            <p className="text-sm text-gray-600">
                                Next Review: April 15, 2025
                            </p>
                        </div>
                        <Button variant="outline">Edit Profile</Button>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
};

export default EmployeeDashboard;