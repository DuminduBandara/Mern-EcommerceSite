import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import Loading from '../components/Loading';
import { Helmet } from 'react-helmet-async';

// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  // const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h1 className="text-3xl">Featured Products</h1>
      <div className="my-[3rem] grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-[2rem] md:gap-[4rem]">
        {loading ? (
          <div>
            <Loading/>
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <Product product={product} key={product.slug}/>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
