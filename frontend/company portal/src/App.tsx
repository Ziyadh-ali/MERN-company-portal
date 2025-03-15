import { Routes, Route } from "react-router-dom"
import AdminLogin from "./components/adminComponents/AdminLogin"
import AdminDashBoard from "./components/adminComponents/AdminDashBoard"
// import UserManagement from "./components/adminComponents/UserManagement"
import AdminProfile from "./components/adminComponents/AdminProfile"
import UserManagement from "./components/adminComponents/UserManagement"

function App() {

  return (
    <>
      <Routes>
        <Route path="/user">
          <Route path="login" element={<AdminLogin />} />
        </Route>
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
