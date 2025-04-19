import { Routes, Route } from "react-router-dom"
import AdminLogin from "./pages/admin/adminPages/AdminLogin"
import AdminDashBoard from "./pages/admin/adminPages/AdminDashBoard"
import AdminProfile from "./pages/admin/adminPages/AdminProfile"
import UserManagement from "./pages/admin/adminPages/UserManagement"
import { SnackbarProvider } from "notistack";
import { AdminProtect, EmployeeProtect } from "./protected/ProtectedRoute"
import { AdminPublic, EmployeePublic } from "./protected/PublicRoutes"
import UserDetails from "./pages/admin/adminPages/UserDetails"
import EmployeeLogin from "./pages/employee/employeePages/employeeLogin"
import EmployeeDashBoard from "./pages/employee/employeePages/employeeDashboard"
import EditProfilePage from "./pages/employee/employeePages/employeeEditProfile"
import EmployeeProfilePage from "./pages/employee/employeePages/employeeProfile"
import AdminEditUserPage from "./pages/admin/adminPages/AdminUserEdit"
import LeavePage from "./pages/employee/employeePages/employeeLeavePage"
import LeaveTypeManagementPage from "./pages/admin/adminPages/LeaveTypeManagement"
import LeaveManagementPage from "./pages/admin/adminPages/LeaveManagement"
import { ResetPasswordPage } from "./pages/employee/employeePages/resetPasswordPage"
import AttendancePage from "./pages/employee/employeePages/AttendancePage"
import MeetingPage from "./pages/employee/employeePages/MeetingPage"
import ChatPage from "./pages/employee/employeePages/ChatPage"
import HelpCenterPage from "./pages/employee/employeePages/HelpCentre"

function App() {

  return (
    <>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Routes>
          <Route path="/">

            <Route element={<EmployeePublic />}>

              <Route path="login" element={<EmployeeLogin />} />

              <Route path="/reset-password" element={<ResetPasswordPage/>} />

            </Route>

            <Route element={<EmployeeProtect />}>

              <Route path="dashboard" element={<EmployeeDashBoard />} />

              <Route path="profile/:id" element={<EditProfilePage/>} />

              <Route path="profile" element={<EmployeeProfilePage/>} />

              <Route path="leave" element={<LeavePage/>} />

              <Route path="attendance" element={<AttendancePage/>} />

              <Route path="meeting" element={<MeetingPage/>} />

              <Route path="messages" element={<ChatPage/>} />

              <Route path="help-desk" element={<HelpCenterPage/>} />
              
            </Route>

          </Route>

          <Route path="/admin">

            <Route element={<AdminPublic />}>

              <Route path="login" element={<AdminLogin />} />

            </Route>

            <Route element={<AdminProtect />}>

              <Route path="dashboard" element={<AdminDashBoard />} />

              <Route path="profile" element={<AdminProfile />} />

              <Route path="users" element={<UserManagement />} />

              <Route path="users/:userId" element={<UserDetails />} />

              <Route path="users/:userId/edit" element={<AdminEditUserPage />} />

              <Route path="leave/types" element={<LeaveTypeManagementPage />} />

              <Route path="leave/requests" element={<LeaveManagementPage />} />

            </Route>

          </Route>

        </Routes>

      </SnackbarProvider>
    </>
  )
}

export default App
