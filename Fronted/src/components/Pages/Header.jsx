import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import React from 'react'

function Header() {
    const {user, logout, loading} = useContext(AuthContext);
     const [showDropdown, setShowDropdown] = useState(false);
  
  if (loading) return null;

  return (
     <header className="flex justify-between items-center px-6 py-3 bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-500">
          E-commerce side
        </div>
        
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6 text-gray-700 font-medium">
        <Link 
          to="/" 
          className="hover:text-purple-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        
        <Link 
          to="/createproduct" 
          className="hover:text-purple-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Create Product
        </Link>
        

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
            
              <span className="text-gray-700">{user.username}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                <Link 
                  to="/profile" 
                  className=" px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300 flex items-center gap-2"
                  onClick={() => setShowDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                
                
                
                <hr className="my-2 border-gray-100" />
                
                <button 
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
export default Header