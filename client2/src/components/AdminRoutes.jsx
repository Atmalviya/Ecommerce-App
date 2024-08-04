import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../services/api";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

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
    return <div>Loading...</div>;
  }

  if (isAdmin) {
    return <>{children}</>;
  }
  return <Navigate to="/products" />;
};

export default AdminRoute;
