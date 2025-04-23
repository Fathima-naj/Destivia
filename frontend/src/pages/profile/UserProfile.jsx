import React, { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import EditProfileForm from './EditProfileForm';
import UserBookings from '../UserBooking';
import Pagebar from '../../components/pagebar';

const UserProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('bookings');
  const [editMode, setEditMode] = useState(false);

  if (!user) return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      

      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 border-b pb-6">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md border border-gray-300"
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
            <p className="text-gray-500 text-sm">{user.primaryEmailAddress.emailAddress}</p>

            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow"
              >
                ✏️ Edit Profile
              </button>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md shadow">
                  🚪 Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mb-6">
            <EditProfileForm user={user} onClose={() => setEditMode(false)} />
          </div>
        )}

        <div className="mb-6 flex justify-center md:justify-start gap-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
              ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            📘 My Bookings
          </button>
          
        </div>

        {activeTab === 'bookings' && <UserBookings />}
      </div>
    </div>
  );
};

export default UserProfile;
