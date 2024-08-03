import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API} from '../services/api';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success(data.message);
      // alert(data.message);
      navigate('/products');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className=' m-5 '>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='mb-4 w-1/4'>
          <label>Email:</label>
          <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className=''/>
        </div>
        <div className='mb-4 w-1/4'>
          <label>Password:</label>
          <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)}placeholder='Enter your password' className=''/>
        </div>
        <div className='flex items-center justify-between max-w-[500px]'>
        <Button type='submit'>Login </Button>
        <Button onClick={(event) => {navigate('/signup')
          event.preventDefault()
        }}>New User? Signup </Button>
        </div>
        {/* <a href="/signup">New User? Signup</a> */}
      </form>
    </div>
  );
};

export default LoginPage;
