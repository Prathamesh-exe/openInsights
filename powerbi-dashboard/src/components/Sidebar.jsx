import React, { memo } from "react";
import { FiGrid, FiList } from "react-icons/fi";

const Sidebar = memo(({ tables, selectedTable, onSelectTable, darkMode, fullReportView, toggleFullReportView }) => {
  return (
    <aside className={`w-64 h-full flex-shrink-0 border-r ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="p-4">
        <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          <FiGrid className="mr-2" /> Reports
        </h2>
        <ul className="overflow-y-auto max-h-[calc(100vh-180px)]">
          {tables.map((table) => (
            <li key={table.name}>
              <button
                onClick={() => onSelectTable(table)}
                className={`w-full text-left p-2 rounded mb-1 ${darkMode ? 
                  (selectedTable?.name === table.name ? "bg-blue-900 text-white" : "hover:bg-gray-700 text-gray-200") : 
                  (selectedTable?.name === table.name ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-800")}`}
                aria-current={selectedTable?.name === table.name ? "true" : "false"}
              >
                {table.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
        <button
          onClick={toggleFullReportView}
          className={`w-full p-2 rounded flex items-center justify-center space-x-2 ${darkMode ? 
            "bg-gray-700 hover:bg-gray-600 text-gray-200" : 
            "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          aria-label={fullReportView ? "Switch to single report view" : "Switch to full report view"}
        >
          <FiList className="flex-shrink-0" />
          <span>{fullReportView ? "Single View" : "Full View"}</span>
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;