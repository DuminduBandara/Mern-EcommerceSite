import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios'
import {Store} from '../Store'
import { toast } from 'react-toastify';
import {getError} from '../utils'

const SignIn = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {state, dispatch: ctxDispatch} = useContext(Store)
  const {userInfo} = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post('api/users/signin', {
        email,
        password,
      })
      ctxDispatch({type: 'USER_SIGNIN', payload: data});
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    }catch(err){
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]); 

  return (
    <div>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">Sign In</h1>
      <div className="flex w-full justify-center my-7 min-h-screen">
        <form className="min-w-[320px] lg:min-w-[400px]" onSubmit={submitHandler}>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Email:</label>
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
          <div className="flex my-5 justify-center w-full">
            <button
              type="submit"
              className="bg-slate-800 text-white rounded-md p-2 w-[100px]"
            >
              Sign In
            </button>
          </div>
          <div>
            New Customer ? {''}
            <Link to={`/signup?redirect=${redirect}`} className="text-slate-500 underline">Create your Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
