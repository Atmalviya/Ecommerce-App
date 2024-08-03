import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";


const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      const { data, status } = await API.post("/auth/register", { email, password });
      if (status === 201) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        navigate("/products");
      }
    } catch (error) {
      
        const apiError = error.response?.data ; 
        console.log(apiError);
        toast.error(apiError.error || "An error occurred")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password:</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center">
            <Button type="submit" className="w-full text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
              Register
            </Button>
            <Button
              variant={"link"}
              className="mt-4"
              onClick={(event) => {
                navigate("/login");
                event.preventDefault();
              }}
            >
              Already a user? Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
