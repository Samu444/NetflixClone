import { Routes, Route } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Movies from "./pages/Movies";
import SeriesPage from "./pages/Series";
import ProtectedRoute from "./components/ProtectedRoute";
import WhosWatching from "./pages/WhosWatching";
import ManageProfiles from "./pages/ManageProfiles";
import RequireProfile from "./components/RequireProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <RequireProfile>
              <Home />
            </RequireProfile>
          </ProtectedRoute>
        }
      />
      <Route
        path="/series"
        element={
          <ProtectedRoute>
            <RequireProfile>
              <SeriesPage />
            </RequireProfile>
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch/:id"
        element={
          <ProtectedRoute>
            <RequireProfile>
              <Watch />
            </RequireProfile>
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch/series/:id"
        element={
          <ProtectedRoute>
            <RequireProfile>
              <Watch />
            </RequireProfile>
          </ProtectedRoute>
        }
      />
      <Route
  path="/whos-watching"
  element={
    <ProtectedRoute>
      <WhosWatching />
    </ProtectedRoute>
  }
/>
<Route
  path="/manage-profiles"
  element={
    <ProtectedRoute>
      <ManageProfiles />
    </ProtectedRoute>
  }
/>
      <Route
  path="/movies"
  element={
    <ProtectedRoute>
      <RequireProfile>
        <Movies />
      </RequireProfile>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;