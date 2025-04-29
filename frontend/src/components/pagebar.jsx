import React, { useState } from "react";
import { MessageCircle,User, ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import travelIcon from "../assets/global-travel.png"; 
import { useUser } from "@clerk/clerk-react"; 

const Pagebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();  

  return (
    <nav className="sticky top-0 z-50 bg-black px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-white">
          <img src={travelIcon} alt="logo" className="w-7 h-7" />
          Destivia
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-4 text-white font-medium ">
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

          <button className="p-1 transition-all duration-200 hover:text-gray-300">
            <Link to="/chat"> 
              <MessageCircle className="w-6 cursor-pointer text-white hover:text-gray-300 h-6" />
            </Link>
          </button>

          

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-white hover:text-blue-600"
            >
              
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User Profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 cursor-pointer h-6" />
              )}
              <ChevronDown className="w-4 cursor-pointer h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute cursor-pointer right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={() => console.log("Logout Clicked")}
                  className="w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <ul className="flex flex-col gap-2 text-white font-medium">
            <li><Link to='/hotels'>Hotels</Link></li>
            <li><Link to='/flight'>Flights</Link></li>
            <li><Link to='/place'>Attractions</Link></li>
          </ul>
          <div className="flex gap-4 mt-2">
            <MessageCircle className="w-6 h-6 text-white" />
            
            <Link to="/sign-in" className="text-gray-700 hover:text-blue-600">Login</Link>
            <button onClick={() => console.log("Logout")} className="text-gray-700 hover:text-blue-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Pagebar;
