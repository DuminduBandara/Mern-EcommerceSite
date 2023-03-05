import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt2 } from 'react-icons/bi';

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <div className="w-full">
      <form onSubmit={submitHandler}>
        <div className="flex bg-white text-black">
          <input
            type="text"
            name="search"
            placeholder="Search Products"
            className="w-full px-2 text-[1rem] outline-none"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className='text-lg p-2 outline-none bg-slate-500 text-white'>
            <BiSearchAlt2 />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
