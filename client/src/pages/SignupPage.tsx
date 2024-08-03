import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {API} from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
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
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            toast.error(error.response?.data.error);
          } else {
            toast.error("An unexpected error occurred");
          }
    }
  };

  return (
    <div className=" m-5 flex items-center justify-center">
      <div className="mb-4 w-1/4 flex flex-col">
        <h1>Login</h1>
        <label>Email:</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className=""
        />
        {/* </div>
      <div className="mb-4 w-1/4"> */}
        <label>Password:</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className=""
        />
        {/* </div>
      <div className="mb-4 w-1/4"> */}
        <label>Confirm Password:</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter confirm password"
          className=""
        />
        {/* </div> */}
        <div className="flex items-center justify-between max-w-[500px]">
          <Button onClick={handleSignUp}>Register </Button>
          <Button
            onClick={(event) => {
              navigate("/login");
              event.preventDefault();
            }}
          >
            Alredy User? Login{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
