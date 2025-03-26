import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Clock,
  Calendar,
  DollarSign,
  HelpCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UserSidebar = () => {
  const { employee } = useSelector((state: RootState) => state.employee || { employee: null });
  // State to manage the visibility of the Employees submenu
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false);

  // Toggle the Employees submenu
  const toggleEmployeesMenu = () => {
    setIsEmployeesOpen(!isEmployeesOpen);
  };

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <img
            src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1741307136/logo-transparent_gra32p.png"
            alt="HR Portal Logo"
            className="h-15"
          />
          <h2 className="text-lg font-semibold text-gray-800">Work Wave</h2>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Clock className="w-5 h-5" />
            <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/leave"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Calendar className="w-5 h-5" />
            <span>Leave</span>
          </NavLink>
          <NavLink
            to="/payroll"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <DollarSign className="w-5 h-5" />
            <span>Payroll</span>
          </NavLink>
          <NavLink
            to="/help-desk"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help Desk</span>
          </NavLink>
          <NavLink
            to="/meeting"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Calendar className="w-5 h-5" />
            <span>Meeting</span>
          </NavLink>
          {employee?.role && (employee.role === "hr" || employee.role === "projectManager") && (
            <div>
              <button
                onClick={toggleEmployeesMenu}
                className={`flex items-center justify-between w-full p-2 rounded-md ${isEmployeesOpen
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Employees</span>
                </div>
                <ChevronRight
                  className={`transform transition-transform duration-200 ${isEmployeesOpen ? "rotate-90" : "rotate-0"
                    } w-5 h-5`}
                />
              </button>
              {isEmployeesOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <NavLink
                    to="/employees/employee-list"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-md text-sm ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-gray-600">•</span>
                    <span>Employee List</span>
                  </NavLink>
                  <NavLink
                    to="/employees/leave-requests"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-md text-sm ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-gray-600">•</span>
                    <span>Leave Requests</span>
                  </NavLink>
                  <NavLink
                    to="/employees/queries"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-md text-sm ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-gray-600">•</span>
                    <span>Queries</span>
                  </NavLink>
                  <NavLink
                    to="/employees/salary"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-md text-sm ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-gray-600">•</span>
                    <span>Salary</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;