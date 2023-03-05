import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckOutSteps from '../components/CheckOutSteps';
import Loading from '../components/Loading';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return {...state, loading: true};
        case 'CREATE_SUCCESS':
            return {...state, loading: false};
        case 'CREATE_FAIL':
            return {...state, loading: false};
        default:
            return state;
    }
}

const PlaceOrder = () => {
  const navigate = useNavigate();

    const [{loading}, dispatch] = useReducer(reducer, {
        loading: false,
    })

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //convert to 2 decimal formate
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try{
        dispatch({type: 'CREATE_REQUEST'})
        const {data} = await axios.post(
            '/api/orders',
            {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            },
            {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            }
        )
        ctxDispatch({type: 'CART_CLEAR'});
        dispatch({type: 'CREATE_SUCCESS'});
        localStorage.removeItem('cartItems');
        navigate(`/order/${data.order._id}`);
    }catch(err){
        dispatch({type: 'CREATE_FAIL'});
        toast.error(getError(err))
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4></CheckOutSteps>
      <Helmet>
        <title>Order Preview</title>
      </Helmet>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">
        Order Preview
      </h1>
      <div className="grid grid-flow-row-dense grid-cols-7 gap-8 mb-5">
        <div className="col-span-9 lg:col-span-5 grid gap-5>">
          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Shipping</h2>
            <div>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Name:</span>{' '}
                {cart.shippingAddress.fullName}
              </h3>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Address:</span>{' '}
                {cart.shippingAddress.address}, {cart.shippingAddress.city}
              </h3>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Postal Code:</span>{' '}
                {cart.shippingAddress.postalCode}
              </h3>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Country:</span>{' '}
                {cart.shippingAddress.country}
              </h3>
            </div>
            <Link
              to="/shipping"
              className="bg-slate-800 text-white rounded-md p-2 w-[80px] text-center"
            >
              Edit
            </Link>
          </div>
          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Payment Method</h2>
            <div>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Payment Method: </span>
                <span className="text-[1.2rem]">{cart.paymentMethod}</span>
              </h3>
            </div>
            <Link
              to="/payment"
              className="bg-slate-800 text-white rounded-md p-2 w-[80px] text-center"
            >
              Edit
            </Link>
          </div>
          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Items</h2>
            <div>
              {cart.cartItems.map((item) => (
                <div key={item._id} className="border-b-2 mb-5 py-2">
                  <div className="grid grid-flow-row-dense grid-cols-9 items-center gap-4">
                    <div className="col-span-9 md:col-span-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[125px] h-[125px] mr-2"
                      />
                      <Link
                        to={` /products/${item.slug}`}
                        className="underline font-semibold"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="col-span-3">
                      <span className="text-xl">{item.quantity}</span>
                    </div>
                    <div className="col-span-2 mb-2 md:mb-0 text-lg font-semibold">
                      LKR{item.price}.00
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/cart"
              className="bg-slate-800 text-white rounded-md p-2 w-[80px] text-center"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="col-span-9 lg:col-span-2">
          <div className="border-2 px-5 py-3">
            <h2 className="text-xl font-semibold py-2">Order Summery</h2>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Items:</div>
              <div className="text-lg font-semibold">
                LKR{cart.itemsPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Shipping:</div>
              <div className="text-lg font-semibold">
                LKR{cart.shippingPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Tax:</div>
              <div className="text-lg font-semibold">
                LKR{cart.taxPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Order Total:</div>
              <div className="text-lg font-semibold">
                LKR{cart.totalPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 justify-center">
              <button
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0}
                className="bg-slate-800 text-white rounded-md p-2 mt-2"
              >
                Place Order
              </button>
            </div>
            {loading && <Loading/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
