import React, { useState } from 'react';
import '../style/Authorization.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('username', name);
    navigate('/dashboard');

  }
  return (
    <div className='auth-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <img className='auth-logo mx-auto' src={logo} alt="SplitMate Logo" />
        <h2>Login to SplitMate</h2>
        <p className='tagline'>Share expenses without the stress.</p>
        <hr className='separator' />

        <input
          type='text'
          placeholder='Username'
          className='auth-input'
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          className='auth-input'
        />

        <button type='submit' className='auth-button'>Login</button>
      </form>
    </div>
  );
};

export default Login;
