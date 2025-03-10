import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../service/Axiosconfig';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError('');
    try {
      const response = await axiosInstance.post('send-otp/', { email });
      if (response.status === 200) {
        alert('OTP sent to your email.');
        setShowOtpField(true);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    try {
      const response = await axiosInstance.post('verify-otp/', { email, otp });
      if (response.status === 200) {
        alert('OTP verified successfully. You can now register.');
        setShowOtpField(false);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid OTP');
    }
  };

  // Function to register user
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
        otp_code: otp, // Send OTP for verification
      });

      if (response.status === 201) {
        setLoading(false);
        alert('Account Created Successfully');
        navigate('/login');
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Registration failed, please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-center pb-12 text-gray-700">Create New Account</h1>
      <div className="w-full p-6 mt-12 bg-white rounded-md shadow-2xl lg:max-w-xl">
        <h2 className="text-xl font-bold text-center text-gray-500 mb-4">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mt-1"
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleSendOtp}
              disabled={showOtpField}
            >
              Send OTP
            </button>
          </div>

          {showOtpField && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md mt-1"
              />
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="number"
              value={mobile_number}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mt-1"
            />
          </div>
          <div className="flex flex-col justify-center mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="mt-4 text-sm text-center text-gray-700">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
