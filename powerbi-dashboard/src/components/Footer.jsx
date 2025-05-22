import React, { memo } from "react";

const Footer = memo(({ darkMode }) => {
  return (
    <footer className={`py-4 ${darkMode ? "bg-gray-900" : "bg-indigo-700"}`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-white text-sm md:text-base">
          &copy; {new Date().getFullYear()} Open Insights. All rights reserved.
        </p>
        <p className="text-white text-xs mt-1 opacity-80">
          Version 1.0.0
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;