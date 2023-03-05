import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const Profile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">
        User Profile
      </h1>
      <div className="flex w-full justify-center my-7 min-h-screen">
        <form
          onSubmit={submitHandler}
          className="min-w-[320px] lg:min-w-[400px]"
        >
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="border-2 border-slate-400 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Confirm Password</label>
            <input
              type="password"
              name="name"
              className="border-2 border-slate-400 p-2"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex my-5 justify-center w-full">
            <button
              type="submit"
              className="bg-slate-800 text-white rounded-md p-2 w-[100px]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
