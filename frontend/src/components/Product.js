import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import Ratings from './Ratings';

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCart = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Product is out of stock");
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <div className="border-2 border-gray-200">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.slug}
          className="h-[300px] w-full"
          style={{ objectFit: 'cover' }}
        />
        <div className="text-xl m-3">
          <h3>{product.name}</h3>
          <Ratings
            rating={product.rating}
            numRatingViews={product.numReviews}
          />
          <p className="mt-2 text-lg font-bold">LKR.{product.price}.00</p>
        </div>
      </Link>
      {product.countInStock === 0 ? (
        <button className='bg-gray-300 text-gray-500 m-3 px-3 py-2 rounded-lg' disabled>Out of stock</button>
      ) : (
        <button
          className="bg-slate-800 text-white m-3 px-3 py-2 rounded-lg"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default Product;
