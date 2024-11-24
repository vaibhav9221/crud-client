// components/Navbar.js

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle logout action
  const handleLogout = () => {
    Cookies.remove("token"); // Remove the token from cookies
    router.push("/login"); // Redirect to the login page
  };

  // Toggle the dropdown menu visibility
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      {/* Logo or App Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          My CRUD App
        </h1>
        
        {/* Navbar Links */}
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="hover:bg-blue-500 px-3 py-2 rounded-md">Dashboard</a>
          <a href="/products" className="hover:bg-blue-500 px-3 py-2 rounded-md">Products</a>
          <a href="#" className="hover:bg-blue-500 px-3 py-2 rounded-md">Orders</a>
          <a href="#" className="hover:bg-blue-500 px-3 py-2 rounded-md">Profile</a>
        </div>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={toggleDropdown} 
          className="flex items-center bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600">
          <span className="mr-2">User</span>
          <svg 
            className="w-4 h-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg w-48 py-2">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
