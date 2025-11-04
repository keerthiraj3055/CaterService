import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./user/pages/Home";
import Menu from "./user/pages/Menu";
import Booking from "./user/pages/Booking";
import Services from "./user/pages/Services";
import Orders from "./user/pages/Orders";
import Cart from "./user/pages/Cart";
import Profile from "./user/pages/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Reviews from "./user/pages/Reviews";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMenu from "./admin/pages/Menu";
import ServicesPage from "./admin/pages/Services";
import AdminOrders from "./admin/pages/Orders";
import AdminBookings from "./admin/pages/Bookings";
import AdminAccounts from "./admin/pages/Accounts";
import AdminReports from "./admin/pages/Reports";
import AdminReviews from "./admin/pages/Reviews";
import Reports from "./admin/pages/Reports";
import Accounts from "./admin/pages/Accounts";
import EmployeeDashboard from "./employee/EmployeeDashboard";
import EmployeeLayout from "./employee/EmployeeLayout";
import AssignedEvents from "./employee/AssignedBookings.jsx";
import Payroll from "./employee/Payroll";
import EmployeeProfile from "./employee/Profile";
import UserDashboard from "./user/UserDashboard";
import CorporateDashboard from "./corporate/CorporateDashboard";
import CorporateRoutes from "./corporate/CorporateRoutes";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

// ✅ Role-based route
const RoleBasedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

// ✅ Hide Navbar/Footer on dashboard & auth pages
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/corporate") ||
    location.pathname.startsWith("/employee");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isDashboard || isAuthPage) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ConditionalLayout>
        <Routes>
          {/* ===============================
              PUBLIC ROUTES
          =============================== */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===============================
              ADMIN ROUTES (mounted at /admin/*)
          =============================== */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleBasedRoute role="admin">
                  <AdminLayout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<Menu />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>

          {/* ===============================
              OTHER DASHBOARDS
          =============================== */}

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute role="user">
                  <UserDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/corporate/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute role="corporate">
                  <CorporateDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          {/* New corporate modular routes */}
          <Route
            path="/corporate/*"
            element={
              <ProtectedRoute>
                <RoleBasedRoute role="corporate">
                  <CorporateRoutes />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* ===============================
              404 FALLBACK
          =============================== */}
          <Route path="*" element={<NotFound />} />
          {/* Employee Routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute>
                <RoleBasedRoute role="employee">
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard/*" element={<EmployeeDashboard />} />
                  </Routes>
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

        </Routes>
      </ConditionalLayout>
    </Router>
  );
};

export default App;
