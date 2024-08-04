import "./App.css";
import { Button } from "@/components/ui/button";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProductListPage from "./pages/ProductListPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import AdminRoutes from "./components/AdminRoutes";
const token = localStorage.getItem("token");

const AuthRoute = ({ children }) => {
  if (token) {
    return <Navigate to="/products" />;
  }
  return <>{children}</>;
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoutes>
                <AdminPage />
              </AdminRoutes>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
