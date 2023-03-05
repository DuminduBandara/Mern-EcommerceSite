import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import {
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
  AiTwotoneDelete,
} from 'react-icons/ai';
import { BsCartX } from "react-icons/bs";
import axios from 'axios';

export const Cart = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItem = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-4xl mb-10">Shopping Cart</h1>
      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="md:col-span-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col justify-center text-2xl py-8 text-center w-full bg-gray-200">
              <Link to="/">
                <div className='w-full text-[10rem] flex justify-center mb-5'>
                  <BsCartX/>
                </div>

              </Link>
              <h1 className='font-semibold text-2xl'>
                Cart is Empty.
                <Link to="/" className="underline">
                  Go Shopping
                </Link>
              </h1>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-flow-row-dense grid-cols-8 gap-10 items-center border-b-4 p-2 mb-7"
                >
                  <div className="flex items-center col-span-6 lg:col-span-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[125px] h-[125px] mr-2"
                    />
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-lg underline font-semibold"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex justify-center items-center col-span-2 text-2xl">
                    <button
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <AiOutlineMinusCircle />
                    </button>
                    <span className="mx-2 text-xl">{item.quantity}</span>
                    <button
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <AiOutlinePlusCircle />
                    </button>
                  </div>
                  <div className="flex items-center col-span-3 lg:col-span-2">
                    <span className="text-xl mb-5 md:mb-0">
                      LKR.{item.price}.00
                    </span>
                  </div>
                  <div className="flex items-center col-span-2 lg:col-span-1">
                    <button
                      onClick={() => removeItem(item)}
                      className="text-2xl"
                    >
                      <AiTwotoneDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-1 mx-3 lg:mx-0">
          <div>
            <h3 className="text-xl">
              <span>SubTotal</span> (
              {cartItems.reduce((a, c) => a + c.quantity, 0)}
              {''}items) : LKR
              {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}.00
            </h3>
          </div>
          <button
            className="bg-slate-800 text-white my-3 rounded-lg p-2"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
