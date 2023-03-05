import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'reactstrap';
import moment from 'moment';
import Home from './Views/Home';
import Product from './Views/Product';
import { Store } from './Store';
import { useContext, useEffect, useState } from 'react';
import { BsCartFill } from 'react-icons/bs';
import { Cart } from './Views/Cart';
import SignIn from './Views/SignIn';
import Shipping from './Views/Shipping';
import SignUp from './Views/SignUp';
import Payment from './Views/Payment';
import PlaceOrder from './Views/PlaceOrder';
import Order from './Views/Order';
import OrderHistory from './Views/OrderHistory';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import Profile from './Views/Profile';
import { HiMenuAlt1 } from 'react-icons/hi';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import Search from './Views/Search';
import Protected from './components/Protected';
import Dashboard from './Views/Dashboard';
import Admin from './components/Admin';
import { IoCloseCircleOutline } from "react-icons/io5";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [showNav, setShowNav] = useState(false);
  const [adminShowNav, setAdminShowNav] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const adminToggleNav = () => {
    setAdminShowNav(!adminShowNav);
  };

  const toggleSideMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div
        className={
          showSideMenu
            ? 'lg:ml-[300px] overflow-visible w-full'
            : 'ml-0 flex flex-col'
        }
      >
        <ToastContainer position="top-center" limit={1} />
        <header className="fixed top-0 left-0 bg-slate-700 text-white text-3xl py-4 px-7 mb-5 flex w-full justify-between items-center">
          <div className="flex items-center">
            <button onClick={toggleSideMenu}>
              <HiMenuAlt1 />
            </button>
            <Link to="/" className="text-2xl mx-10">
              Reppel
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative w-[50px]">
              <Link to="/cart" className="text-white">
                <BsCartFill className="text-2xl" />
                {cart.cartItems.length > 0 && (
                  <h5 className="text-sm bg-slate-300 text-black w-6 h-6  rounded-full absolute top-[-0.7rem] right-3 flex justify-center items-center">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </h5>
                )}
              </Link>
            </div>
            <div className="flex">
              {userInfo ? (
                <div className="flex text-xl items-center gap-6 relative">
                  <Link onClick={toggleNav} className="flex items-center">
                    <h1>{userInfo.name}</h1>
                    {showNav ? (
                      <IoMdArrowDropup className="text-3xl" />
                    ) : (
                      <IoMdArrowDropdown className="text-3xl" />
                    )}
                  </Link>
                  {showNav && (
                    <div className="absolute flex flex-col gap-2 top-7 right-[-5px] bg-slate-700 w-[150px] p-2 text-[1rem]">
                      <Link to="/profile">UserProfile</Link>
                      <Link to="/orderHistory">Order History</Link>
                      <Link to="#" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white text-slate-800 text-xl py-1 px-2 rounded-lg">
                  <Link to="/signin">Sign In</Link>
                </div>
              )}
              {userInfo && userInfo.isAdmin && (
                <div className="flex text-xl items-center gap-6 relative">
                  <Link onClick={adminToggleNav} className="flex items-center">
                    <h1>Admin</h1>
                    {adminShowNav ? (
                      <IoMdArrowDropup className="text-3xl" />
                    ) : (
                      <IoMdArrowDropdown className="text-3xl" />
                    )}
                  </Link>
                  {adminShowNav && (
                    <div className="absolute flex flex-col gap-2 top-7 right-[-5px] bg-slate-700 w-[150px] p-2 text-[1rem]">
                      <Link to="/admin/dashboard">Dashboard</Link>
                      <Link to="/admin/productlist">Products</Link>
                      <Link to="/admin/orderlist">Orders</Link>
                      <Link to="/admin/userlist">Users</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div
          className={
            showSideMenu
              ? 'fixed w-screen md:w-[300px] left-0 top-0 h-screen bg-slate-800 text-white flex flex-col pt-10 pl-5'
              : 'fixed w-[0px] hidden'
          }
        >
          <button onClick={toggleSideMenu} className='absolute top-5 right-5 text-3xl'>
            <IoCloseCircleOutline/>
          </button>
          <h1 className="text-2xl mb-4">Categories</h1>
          {categories.map((category) => (
            <div key={category}>
              <div
                to={`/search?category=${category}`}
                onClick={() => setShowSideMenu(!showSideMenu)}
                className="text-lg mb-4"
              >
                <Link>{category}</Link>
              </div>
            </div>
          ))}
        </div>

        <div className='w-[250px] ml-[5rem] mb-5 border-4 rounded-lg overflow-hidden mt-[80px]'>
          <SearchBox />
        </div>

        <main className="min-h-[80vh] mx-3 lg:mx-[5rem] md:mx-[3rem]">
          <Routes>
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route
              path="/order/:id"
              element={
                <Protected>
                  <Order />
                </Protected>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <Protected>
                  <OrderHistory />
                </Protected>
              }
            />
            <Route path="/search" element={<Search />} />
            <Route
              path="/admin/dashboard"
              element={
                <Admin>
                  <Dashboard />
                </Admin>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <div className="bg-slate-700 text-white py-3 text-center">
          <h4>&copy; {moment().format('YYYY')} Dumindu, All Right Reserved</h4>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
