import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {API} from "../services/api";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await API.get("/products/admin");
        setIsAdmin(data.admin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    // toast.error("Loadin admin status... Please wait! :)");
    return <div>Loading...</div>; // or some loading indicator
  }

  if (!isAdmin) {
    return <Navigate to="/products" />;
  }
  return <>{children}</>;
};

export default AdminRoute;
