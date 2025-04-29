import React, { useState } from "react";
import { MessageCircle, User, ChevronDown, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import travelIcon from "../../assets/global-travel.png";
import { useUser, SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const TopNavbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    toast.success("Signed out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-white px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-300 sticky top-0 z-50 shadow-md">
      
      {/* Top row: Logo + Menu Button */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-orange-700">
          <img src={travelIcon} alt="logo" className="w-7 h-7" />
          <span>
            <span className="text-black">Dest</span><span>ivia</span>
          </span>
        </Link>
        <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-4 text-black font-medium">
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to="/hotels">Hotels</Link>
          </li>
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to="/flight">Flights</Link>
          </li>
          <li className="hover:border-b-2 hover:border-gray-300 transition">
            <Link to="/places">Attractions</Link>
          </li>
        </ul>

        <SignedIn>
          <Link to="/chat" className="text-gray-600 hover:text-blue-600">
            <MessageCircle className="w-6 h-6" />
          </Link>
        </SignedIn>


        {/* Auth Logic */}
        <div className="relative">
          <SignedIn>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="User" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <SignOutButton signOutCallback={handleSignOut}>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 w-full">
          <ul className="flex flex-col gap-2 text-black font-medium">
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/flight">Flights</Link></li>
            <li><Link to="/places">Attractions</Link></li>
          </ul>

          <div className="flex flex-col gap-4 mt-2">
          <SignedIn>
          <Link to="/chat" className="flex items-center gap-2 text-gray-700">
            <MessageCircle className="w-6 h-6" />
            Chat
          </Link>
        </SignedIn>


            <SignedIn>
              <SignOutButton signOutCallback={handleSignOut}>
                <button className="text-left text-gray-700 hover:text-blue-600">
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-left text-gray-700 hover:text-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
