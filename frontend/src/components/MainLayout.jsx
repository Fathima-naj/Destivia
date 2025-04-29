import React from 'react';
import { Outlet } from 'react-router-dom';
import Pagebar from './pagebar';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-10">
        <Pagebar />
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className=" text-black text-center p-4 mt-auto">
        &copy; 2025 Destivia. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;
