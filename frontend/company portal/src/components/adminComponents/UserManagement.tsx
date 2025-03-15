import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";
import AddUserModal from "../modals/AddUserModal";
import { useNavigate } from "react-router-dom";

function UserManagement() {
    const navigate = useNavigate()
  const handleAddUser = (userData: { name: string; email: string; role: string; department: string }) => {
    console.log("New user added:", userData);
    navigate("/admin/Users")
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex-1 p-6">
        <AdminHeader />
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Manage all users in the system
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="text-center p-4">
                  <p className="text-2xl font-bold text-gray-800">100</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-4">
                  <p className="text-2xl font-bold text-gray-800">90</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-4">
                  <p className="text-2xl font-bold text-gray-800">10</p>
                  <p className="text-sm text-gray-600">Inactive Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-4">
                  <p className="text-2xl font-bold text-gray-800">5</p>
                  <p className="text-sm text-gray-600">New Users</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search users..."
                className="w-full md:w-1/3"
              />
              <div className="flex space-x-4">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="hr">HR Manager</SelectItem>
                    <SelectItem value="project">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <AddUserModal onAddUser={handleAddUser} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Access Level</th>
                    <th className="px-4 py-2">Last Login</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src="https://via.placeholder.com/32"
                          alt="Sarah Wilson"
                        />
                        <AvatarFallback>SW</AvatarFallback>
                      </Avatar>
                      <span>Sarah Wilson</span>
                    </td>
                    <td className="px-4 py-2">HR Manager</td>
                    <td className="px-4 py-2">
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-2">Level 2</td>
                    <td className="px-4 py-2">2025-02-15 09:31</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline">👁️</button>
                        <button className="text-red-600 hover:underline">🗑️</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src="https://via.placeholder.com/32"
                          alt="Michael Chen"
                        />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <span>Michael Chen</span>
                    </td>
                    <td className="px-4 py-2">Project Manager</td>
                    <td className="px-4 py-2">
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-2">Level 3</td>
                    <td className="px-4 py-2">2025-02-15 08:45</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline">👁️</button>
                        <button className="text-red-600 hover:underline">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Showing 1 to 10 of 100 results</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <span className="flex items-center">1 2 3</span>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserManagement;