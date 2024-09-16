import React from 'react'

const Header = ({title}) => (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            👤
          </div>
        </div>
      </div>
    </header>
  );
  
export default Header
