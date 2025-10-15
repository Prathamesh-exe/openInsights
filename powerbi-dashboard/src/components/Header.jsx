import React, { memo } from "react";
import { FiSun, FiMoon, FiMessageSquare } from "react-icons/fi";
import PropTypes from 'prop-types';

const Header = memo(({ darkMode, toggleDarkMode, toggleChatWindow }) => {
  const handleChatClick = (e) => {
    e.stopPropagation();
    toggleChatWindow();
  };

  return (
    <header className={`sticky top-0 z-50 shadow-lg ${darkMode ? "bg-gray-800" : "bg-gray-700"}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Open Insights</h1>
          <p className="text-xs text-gray-300">Your Data, Your Insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleChatClick}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-600"
            } text-white transition-colors`}
            aria-label="Open Chat Assistant"
          >
            <FiMessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-600"
            } text-white transition-colors`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  toggleChatWindow: PropTypes.func.isRequired
};

Header.displayName = "Header";
export default Header;