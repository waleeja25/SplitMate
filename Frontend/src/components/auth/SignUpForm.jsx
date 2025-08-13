import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import alertDisplay from '../ui/alertDisplay.jsx';

const SignupForm = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
     try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.username, 
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setAlert({
          type: 'error',
          title: 'Error',
          message: result.message || 'Something went wrong',
        });
        return;
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('username', result.user.name);
      localStorage.setItem('email', result.user.email);

      navigate('/login');
    } catch (err) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: err.message,
      });
    }
  };

  const onError = (errors) => {
    if (errors.username && errors.password && errors.confirmPassword) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'All fields are required.',
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
    } else if (errors.confirmPassword?.type === 'required') {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Please confirm your password.',
      });
    } else if (errors.confirmPassword?.type === 'validate') {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Passwords do not match.',
      });
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f5f5f5] pt-16 overflow-hidden font-['Montserrat']">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white px-10 py-8 rounded-xl shadow-lg w-full max-w-md text-center"
      >
        <img
          src={logo}
          alt="SplitMate Logo"
          className="w-20 h-22 object-cover rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl text-gray-800 font-semibold">
          Create your SplitMate account
        </h2>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Start sharing expenses stress-free.
        </p>
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
          type="text"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
          className="w-full px-4 py-3 mt-3 mb-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1cc29f] transition"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          aria-invalid={errors.password ? 'true' : 'false'}
          className="w-full px-4 py-3 mt-2 mb-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1cc29f] transition"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', {
            required: true,
            validate: (value) => value === password,
          })}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          className="w-full px-4 py-3 mt-2 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1cc29f] transition"
        />

        <button
          type="submit"
          className="w-full py-3 text-white rounded-md font-bold text-base bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
