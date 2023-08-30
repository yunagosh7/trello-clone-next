"use client";
// This tag converts the server side component  in a client side component
import Image from "next/image";
import React from "react";
import logo from "@/assets/Trello-Logo-2011-2016.png";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";

function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString
  ])
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        
        <div 
          className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-md filter blur-3xl opacity-50 -z-50"
        />
        
        <Image
          src={logo}
          alt="Trello logo"
          width={300}
          height={100}
          className="w-44 md:56 pb-10 md:pb-0 object-contain "
        />

        <div className="flex items-center space-x-5 flex-1 justify-end">
          {/* Search box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={e => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name='Juan Cruz Vila' round size="50" color="#0055d1" />
        </div>
      </div>


    </header>
  );
}

export default Header;
