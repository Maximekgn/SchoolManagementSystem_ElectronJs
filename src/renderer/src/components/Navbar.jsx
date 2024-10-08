import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 text-xl font-bold">Logo</div>
          <div className="flex items-center">
            {/* Autres éléments de navigation */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;