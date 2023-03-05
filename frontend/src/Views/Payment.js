import React, { useContext, useEffect, useState } from 'react';
import CheckOutSteps from '../components/CheckOutSteps';
import { Helmet } from 'react-helmet-async';
import {useNavigate} from 'react-router-dom';
import {Store} from '../Store';


const Payment = () => {

    const navigate = useNavigate();

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {shippingAddress, paymentMethod},
    } = state;

    const [paymentMethodType, setPaymentMethod] = useState(
        paymentMethod || 'Paypal'
    )

    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodType});
        localStorage.setItem('paymentMethod', paymentMethodType);
        navigate('/placeorder')
    }
  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckOutSteps step1 step2 step3></CheckOutSteps>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">Payment Method</h1>
      <div className="flex w-full justify-center my-7">
        <form onSubmit={submitHandler}>
            <div className='mb-3'>
                <input
                type="radio"
                id="Paypal"
                name="paymentMethod"
                value="Paypal"
                checked={paymentMethodType === 'Paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <label className="text-lg mb-1 ml-2">Paypal</label>
            </div>
            <div >
                <input
                type="radio"
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethodType === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="text-lg mb-1 ml-2">Stripe</label>
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

export default Payment;
