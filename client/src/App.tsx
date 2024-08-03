import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/SignupPage';
import { toast } from 'sonner';
import AdminRoute from "./components/AdminRoutes";

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/products" />;
  }
  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token is found, user is not authenticated
    toast.error("Please login first");
    return <Navigate to="/login" />;
  }
  return <>{children}</>; // If authenticated, render the child components
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute>
              <LoginPage />
            </AuthRoute>} />
        <Route path='/signup' element={<AuthRoute>
              <SignupPage />
            </AuthRoute>} />
        <Route path="/products" element={<PrivateRoute>
              <ProductListPage />
            </PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute>
              <CartPage />
            </PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </PrivateRoute>} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
