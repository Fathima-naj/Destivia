import React, { useState } from "react";
import { MessageCircle, Video, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import travelIcon from "../../assets/global-travel.png"; 
import { useUser, SignInButton, SignOutButton } from "@clerk/clerk-react";

const TopNavbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="bg-white px-6 py-3 flex items-center justify-between border-b border-b-gray-300 sticky top-0 z-50 shadow-md">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-orange-700">
        <img src={travelIcon} alt="logo" className="w-7 h-7" />
        <span>
          <span className="text-black">Dest</span><span>ivia</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <ul className="flex gap-4 text-black font-medium ">
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to='/hotels'>Hotels</Link>
          </li>
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to='/flight'>Flights</Link>
          </li>
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to='/places'>Attractions</Link>
          </li>
        </ul>

        {/* Message and Video Icons */}
        <button className="text-gray-600 cursor-pointer hover:text-blue-600">
          <Link to='chat'><MessageCircle className="w-6 h-6" /></Link>
        </button>

        

        {/* User Dropdown or Sign In Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-blue-600"
            >
              <User className="w-6 h-6" />
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <SignOutButton>
                  <button className="w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        ) : (
          <SignInButton>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
