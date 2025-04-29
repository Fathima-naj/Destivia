import React, { useState } from "react";
import { MessageCircle, User, ChevronDown, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import travelIcon from "../assets/global-travel.png";
import { useUser, useClerk, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Pagebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk(); // ✅ Get signOut from Clerk
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(); // ✅ Correct signOut usage
      toast.success("Signed out successfully!");
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out!");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-white">
          <img src={travelIcon} alt="logo" className="w-7 h-7" />
          Destivia
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-4 text-white font-medium">
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
          <button className="p-1 transition-all duration-200 hover:text-gray-300">
            <Link to="/chat">
              <MessageCircle className="w-6 h-6 text-white hover:text-gray-300" />
            </Link>
          </button>
          </SignedIn>

          {/* Profile & Dropdown */}
          <div className="relative">
            <SignedIn>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-blue-600"
              >
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="User Profile" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 text-white hover:text-blue-600">
                  <User className="w-6 h-6" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <ul className="flex flex-col gap-2 text-white font-medium">
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/flight">Flights</Link></li>
            <li><Link to="/places">Attractions</Link></li>
          </ul>

          <div className="flex flex-col gap-4 mt-2">
            <SignedIn>
            <Link to="/chat" className="flex items-center gap-2 text-white">
              <MessageCircle className="w-6 h-6" />
              Chat
            </Link>
            </SignedIn>

            <SignedIn>
              <button onClick={handleSignOut} className="text-white hover:text-blue-600">
                Logout
              </button>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white hover:text-blue-600">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Pagebar;
