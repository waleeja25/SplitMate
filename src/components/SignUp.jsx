import React from 'react';
import '../style/Authorization.css';
import logo from '../assets/logo.png';

const Signup = () => {
  return (
    <div className='auth-container'>
      <form className='auth-form'>
        <img className='auth-logo' src={logo} alt="SplitMate Logo" />
        <h2>Create your SplitMate account</h2>
        <p className='tagline'>Start sharing expenses stress-free.</p>
        <hr className='separator' />

        <input
          type='text'
          placeholder='Full Name'
          className='auth-input'
        />
        <input
          type='email'
          placeholder='Email Address'
          className='auth-input'
        />
        <input
          type='password'
          placeholder='Password'
          className='auth-input'
        />
        <input
          type='password'
          placeholder='Confirm Password'
          className='auth-input'
        />

        <button type='submit' className='auth-button'>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
