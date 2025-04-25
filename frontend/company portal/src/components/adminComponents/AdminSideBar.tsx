import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSideBar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        {/* Logo and Title */}
        <div
          className="flex items-center space-x-2 mb-6 cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img
            src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1741307136/logo-transparent_gra32p.png"
            alt="logo"
            className="h-15"
          />
          <h2 className="text-lg font-semibold text-gray-800">Work Wave</h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {[
            { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
            { path: "/admin/users", label: "User Management", icon: "👥" },
            { path: "/admin/leave/requests", label: "Leave Management", icon: "📅" },
            { path: "/admin/leave/types", label: "Leave Type Management", icon: "📅" },
            { path: "/admin/payroll", label: "Payroll", icon: "💰" },
            { path: "/admin/attendance", label: "Attendance", icon: "⏰" },
            { path: "/admin/reports", label: "Reports", icon: "📊" },
            { path: "/admin/help", label: "Help Centre", icon: "❓" },
          ].map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition ${
                  isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
