import React, { useState } from 'react';
import axiosInstance from '../service/Axiosconfig';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // Track form step
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setError('');
    try {
      const response = await axiosInstance.post('accounts/send-otp/', { email });
      if (response.status === 200) {
        toast('OTP sent to your email.');
        setStep(2); // Move to OTP verification step
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setError('');
    try {
      const response = await axiosInstance.post('accounts/verify-otp/', { email, otp });
      if (response.status === 200) {
        toast.success('OTP verified successfully.');
        setOtpVerified(true);
        setStep(3); // Move to final registration step
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid OTP');
    }
  };

  // Step 3: Register User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('register/', {
        username,
        email,
        password,
        mobile_number,
      });

      if (response.status === 201) {
        setLoading(false);
        toast.success('Account Created Successfully');
        navigate('/login');
      }
    } catch (error) {
      setLoading(false);
      setError(error  || 'Registration failed, please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700">Create New Account</h1>
      
      <div className="w-full p-6 mt-6 bg-white rounded-md shadow-xl lg:max-w-xl">
        {error && <p className="text-red-500 text-center mb-4">{error.response}</p>}

          <>
            <h2 className="text-xl font-bold text-center text-gray-500 mb-4">Enter Your Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="number" value={mobile_number} onChange={(e) => setMobile(e.target.value)} required className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
         
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md mt-1" />
            </div>
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </>
        
      </div>
    <ToastContainer/>
    </div>
  );
};

export default RegisterPage;
