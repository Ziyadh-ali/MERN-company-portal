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

function App() {

  return (
    <>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Routes>
          <Route path="/">

            <Route element={<EmployeePublic />}>

              <Route path="login" element={<EmployeeLogin />} />

            </Route>

            <Route element={<EmployeeProtect />}>

              <Route path="dashboard" element={<EmployeeDashBoard />} />

              <Route path="profile/:id" element={<EditProfilePage/>} />

              <Route path="profile" element={<EmployeeProfilePage/>} />

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

            </Route>

          </Route>

        </Routes>

      </SnackbarProvider>
    </>
  )
}

export default App
