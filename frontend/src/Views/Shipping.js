import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from '../components/CheckOutSteps';
import { Store } from '../Store';

const Shipping = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>Shipping</Helmet>
      <CheckOutSteps step1 step2></CheckOutSteps>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">
        Shipping Details
      </h1>
      <div className="flex w-full justify-center my-7 min-h-screen">
        <form
          className="min-w-[320px] lg:min-w-[500px]"
          onSubmit={submitHandler}
        >
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-2 border-slate-400 px-2 py-1"
              required
              placeholder="Enter full name"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Address</label>
            <input
              type="text"
              name="fullName"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-2 border-slate-400 px-2 py-1"
              required
              placeholder="Enter shipping address"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">City</label>
            <input
              type="text"
              name="fullName"
              value={city}
              className="border-2 border-slate-400 px-2 py-1"
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Enter city"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Postal Code</label>
            <input
              type="text"
              name="fullName"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="border-2 border-slate-400 px-2 py-1"
              required
              placeholder="Enter Postal Code"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-lg mb-1">Country</label>
            <input
              type="text"
              name="fullName"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border-2 border-slate-400 px-2 py-1"
              required
              placeholder="Enter country"
            />
          </div>
          <div className="flex my-5 justify-center w-full">
            <button
              type="submit"
              className="bg-slate-800 text-white rounded-md p-2 w-[100px]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
