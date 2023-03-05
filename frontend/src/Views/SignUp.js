import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SignUp = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">
        Sign Up
      </h1>
      <div className="flex w-full justify-center my-7 min-h-screen">
        <form
          className="min-w-[320px] lg:min-w-[400px]"
          onSubmit={submitHandler}
        >
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              required
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Confirm Password</label>
            <input
              type="password"
              name="password"
              placeholder="Confirm your password"
              required
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex my-5 justify-center w-full">
            <button
              type="submit"
              className="bg-slate-800 text-white rounded-md p-2 w-[100px]"
            >
              Sign Up
            </button>
          </div>
          <div>
            Already have an Account ? {''}
            <Link
              to={`/signin?redirect=${redirect}`}
              className="text-slate-500 underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
