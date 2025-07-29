import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import alertDisplay from '../ui/alertDisplay.jsx';


const LoginForm = () => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onError = (errors) => {
    if (errors.username && errors.password) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Please enter both username and password to continue.',
      });
    } else if (errors.username) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Username is required.',
      });
    } else if (errors.password) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Password is required.',
      });
    }
  };


  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const onSubmit = (data) => {
    localStorage.setItem('username', data.username);
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f5f5f5] pt-16 overflow-hidden font-['Montserrat']">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white px-10 py-7 rounded-xl shadow-lg w-full max-w-md text-center"
      >
        <img
          src={logo}
          alt="SplitMate Logo"
          className="w-20 h-22 object-cover rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl text-gray-800 font-semibold">Login to SplitMate</h2>
        <p className="text-sm text-gray-500 mt-2 mb-4">Share expenses without the stress.</p>
        <hr className="border-t border-gray-300 my-4" />

        <div className="text-left w-full">
          {alert && alertDisplay(alert)}
        </div>


        <input
          type="text"
          placeholder="Username"
          {...register('username', { required: true })}
          aria-invalid={errors.username ? 'true' : 'false'}
          className="w-full px-4 py-3 mt-3 mb-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1cc29f] transition"
        />

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          aria-invalid={errors.password ? 'true' : 'false'}
          className="w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1cc29f] transition"
        />

        <button
          type="submit"
          className="w-full py-3  text-white rounded-md font-bold text-base bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
