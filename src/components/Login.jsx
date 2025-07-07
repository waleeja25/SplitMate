import React from 'react';
import '../style/Authorization.css';
import logo from '../assets/logo.png';

const Login = () => {
  return (
    <div className='auth-container'>
      <form className='auth-form'>
        <img className='auth-logo' src={logo} alt="SplitMate Logo" />
        <h2>Login to SplitMate</h2>
        <p className='tagline'>Share expenses without the stress.</p>
        <hr className='separator' />

        <input
          type='text'
          placeholder='Username'
          className='auth-input'
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
