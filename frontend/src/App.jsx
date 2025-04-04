import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import AdminDashboard from "./pages/AdminDashboard";  //  Admin Page
import StudentDashboard from "./pages/StudentDashboard";  //  Student Page
import ProtectedRoute from "./components/ProtectedRoute"
import JoinTeam from "./pages/findTeam"; //joining a team page
import PendingRequest from "./pages/PendingRequest"
import TeamHomepage from "./pages/TeamHomepage"
import MyTeams from "./pages/MyTeams"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Protected Home Route 
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        */}

        {/*  Admin Dashboard (Only for Admins) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/*  Student Dashboard (Only for Students) */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <redirectRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-team"
          element={
            <ProtectedRoute requiredRole="Student">
              <JoinTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pending-join-requests"
          element={
            <ProtectedRoute requiredRole="Admin">
              <PendingRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-homepage"
          element={
            <ProtectedRoute requiredRole="Student">
              <TeamHomepage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-teams"
          element={
            <ProtectedRoute requiredRole="Student">
              <MyTeams/>
            </ProtectedRoute>
          }
        />
        


        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
