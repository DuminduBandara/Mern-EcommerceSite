import React, { useContext, useEffect, useReducer } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Ratings from '../components/Ratings';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import ErrorPage from '../components/404';
import { Store } from '../Store';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Product = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {cart} = state;

  const addToCart = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`)
    if(data.countInStock < quantity) {
      toast.error("Product is out of stock");
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity},
    });
    navigate('/cart');
  };

  return loading ? (
    <div>
      <Loading />
    </div>
  ) : error ? (
    <ErrorPage />
  ) : (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
      <div>
        <img
          src={product.image}
          alt={product.slug}
          className="h-[400px] w-full"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="mx-5 p-5 border-2 border-gray-200">
        <Helmet>
          <title>{product.name}</title>
        </Helmet>
        <div>
          <h3 className="text-2xl mb-2">{product.name}</h3>
        </div>
        <div className="mb-2">
          <Ratings
            rating={product.rating}
            numRatingViews={product.numReviews}
          />
        </div>
        <div className="mb-2">
          <h2>
            <span className="text-xl">Price: </span>
            <span className="text-2xl font-semibold">
              LKR.{product.price}.00
            </span>
          </h2>
        </div>
        <div>
          <p>
            <span className="text-xl">Description:</span>
            <br />
            {product.description}
          </p>
        </div>
      </div>
      <div className="mx-5 mb-4 p-5 border-2 border-gray-200">
        <div>
          <h2>
            <span className="text-xl">Price: </span>
            <span className="text-xl font-semibold px-4">
              LKR.{product.price}.00
            </span>
          </h2>
        </div>
        <div>
          <span className="text-xl">Status: </span>
          {product.countInStock > 0 ? (
            <button className="bg-green-500 text-white text-sm font-bold p-2 rounded-lg mt-2">
              In stock
            </button>
          ) : (
            <button className="bg-red-500 text-white text-sm font-bold p-2 rounded-lg mt-2">
              Out of stock
            </button>
          )}
        </div>
        <div className="mt-2">
          {product.countInStock > 0 && (
            <button
              className="bg-slate-800 text-white px-4 py-2 rounded-lg mt-2"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
