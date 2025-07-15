import React from 'react';
import '../../style/Authorization.css'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    navigate('/dashboard');

  }
  return (
    <div className='auth-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <img className='auth-logo mx-auto' src={logo} alt="SplitMate Logo" />
        <h2>Create your SplitMate account</h2>
        <p className='tagline'>Start sharing expenses stress-free.</p>
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

export default SignupForm;
