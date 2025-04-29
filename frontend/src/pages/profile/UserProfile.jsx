import React, { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import EditProfileForm from './EditProfileForm';
import UserBookings from '../UserBooking';
import { FaEdit, FaSignOutAlt, FaBookmark } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('bookings');
  const [editMode, setEditMode] = useState(false);

  if (!user) return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         
          <div className="relative h-48 bg-yellow-800/10">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-2xl shadow-xl border-4 border-white object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-yellow-900">{user.username}</h1>
                <p className="text-gray-600 mt-1">{user.primaryEmailAddress.emailAddress}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-800 hover:bg-yellow-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <FaEdit /> Edit Profile
                </button>
                <SignOutButton>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                    <FaSignOutAlt /> Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>

            
            <div className="mt-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative
                  ${activeTab === 'bookings' 
                    ? 'text-yellow-800 border-b-2 border-yellow-800' 
                    : 'text-gray-500 hover:text-yellow-800'}`}
              >
                <FaBookmark />
                My Bookings
                <span className="ml-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                  Active
                </span>
              </button>
            </div>

            
            {editMode && <EditProfileForm user={user} onClose={() => setEditMode(false)} />}
            {activeTab === 'bookings' && <div className="mt-6"><UserBookings /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
