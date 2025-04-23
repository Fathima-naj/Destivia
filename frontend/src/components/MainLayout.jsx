import React from 'react';
import { Outlet } from 'react-router-dom';
import Pagebar from './pagebar';
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Header or Top Navigation */}
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <Pagebar />
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <Outlet />
      </main>

      {/* Optional Footer */}
      <footer className="bg-white text-center p-4 shadow-inner mt-auto">
        &copy; 2025 Destivia. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;
