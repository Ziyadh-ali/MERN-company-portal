import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";


function AdminDashBoard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar/>
      <div className="flex-1 p-6">
        <AdminHeader/>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">10</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Payroll Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">$50,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">5%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">85%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Leave Requests */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600">Recent Leave Requests</CardTitle>
              <a href="#" className="text-blue-600 text-sm">View All</a>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/40" alt="Sarah Johnson" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                    <p className="text-xs text-gray-600">Sick Leave - 2 days</p>
                  </div>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/40" alt="Mike Peters" />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Mike Peters</p>
                    <p className="text-xs text-gray-600">Vacation - 5 days</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Approved
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payroll */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600">Recent Payroll</CardTitle>
              <a href="#" className="text-blue-600 text-sm">View All</a>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">March 2025</p>
                  <p className="text-xs text-gray-600">Processing</p>
                </div>
                <span className="text-sm font-medium text-gray-800">$48,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">February 2025</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <span className="text-sm font-medium text-gray-800">$48,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600">Attendance Overview</CardTitle>
              <a href="#" className="text-blue-600 text-sm">View All</a>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">90 Employees</p>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Present
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">10 Employees</p>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  Absent
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600">Project Status</CardTitle>
              <a href="#" className="text-blue-600 text-sm">View All</a>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Website Redesign</p>
                  <span className="text-sm text-gray-800">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Mobile App</p>
                  <span className="text-sm text-gray-800">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm text-gray-600">Recent Activity</CardTitle>
            <a href="#" className="text-blue-600 text-sm">View All</a>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/40" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-600">Developer</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Leave Request Submitted</p>
              <p className="text-xs text-gray-600">March 15, 2025</p>
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/40" alt="Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">Jane Smith</p>
                  <p className="text-xs text-gray-600">Designer</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Project Update</p>
              <p className="text-xs text-gray-600">March 14, 2025</p>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Completed
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashBoard