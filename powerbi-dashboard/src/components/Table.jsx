import React, { memo } from "react";

const Table = memo(({ columns, rows, darkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`p-3 border ${darkMode ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-800"}`}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? (darkMode ? "bg-gray-900" : "bg-gray-50") : ''} ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={`p-3 border ${darkMode ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-800"}`}
                  >
                    {row[col.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

Table.displayName = 'Table';
export default Table;