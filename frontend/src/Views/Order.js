import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Loading from '../components/Loading';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
}

const Order = () => {
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order.id && order._id !== order.id)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'restOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);
  return loading ? (
    <Loading />
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="text-3xl my-5 text-center font-semibold text-slate-800">
        Order: {orderId}
      </h1>
      <div className="grid grid-flow-row-dense grid-cols-7 gap-8 mb-5">
        <div className="col-span-9 lg:col-span-5 grid gap-5">
          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Shipping</h2>
            <div>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Name:</span>{' '}
                {order.shippingAddress.fullName}
              </h3>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Address:</span>{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.country}
              </h3>
            </div>
            {order.IsDelivered ? (
              <div className="text-white bg-green-500 py-3 pl-3">
                Delivered at {order.deliveredAt}
              </div>
            ) : (
              <div className="text-white bg-red-500 py-3 pl-3">
                Not Delivered
              </div>
            )}
          </div>

          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Payment Method</h2>
            <div>
              <h3 className="mb-2 text-[1rem]">
                <span className="font-semibold">Payment Method: </span>
                <span className="text-[1.2rem]">{order.paymentMethod}</span>
              </h3>
            </div>
            {order.isPaid ? (
              <div className="text-white bg-green-500 py-3 pl-3">
                Paid at {order.paidAt}
              </div>
            ) : (
              <div>
                <div className="text-white bg-red-500 py-3 pl-3">Not Paid</div>
              </div>
            )}
          </div>

          <div className="p-5 border-2 flex flex-col">
            <h2 className="text-xl font-semibold py-2">Items</h2>
            <div>
              {order.orderItems.map((item) => (
                <div key={item._id} className="border-b-2 mb-5 py-2">
                  <div className="grid grid-flow-row-dense grid-cols-9 items-center gap-4">
                    <div className="col-span-9 md:col-span-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[125px] h-[125px] mr-2"
                      />
                      <Link
                        to={`/product/${item.slug}`}
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
          </div>
        </div>
        <div className="col-span-9 lg:col-span-2">
          <div className="border-2 px-5 py-3">
            <h2 className="text-xl font-semibold py-2">Order Summery</h2>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Items:</div>
              <div className="text-lg font-semibold">
                LKR{order.itemsPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Shipping:</div>
              <div className="text-lg font-semibold">
                LKR{order.shippingPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center mb-3 border-b-2 pb-2">
              <div className="font-semibold mr-2">Tax:</div>
              <div className="text-lg font-semibold">
                LKR{order.taxPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center text-xl mb-3 pb-2">
              <div className="font-semibold mr-2">Total:</div>
              <div className="font-semibold">
                LKR{order.totalPrice.toFixed(2)}
              </div>
            </div>
            {!order.isPaid && (
              <div>
                {isPending ? (
                  <Loading />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                )}
                {loadingPay && <Loading />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
