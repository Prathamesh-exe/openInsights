import React, { useEffect, useState, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { TailSpin } from 'react-loader-spinner';
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import ScatterPlot from "./components/ScatterPlot";
import Table from "./components/Table";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ChatWindow from "./components/ChatWindow";

const API_BASE_URL = "http://localhost:5000";

const App = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fullReportView, setFullReportView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Transform raw data into visualization-ready format
  const transformData = useCallback((rawData) => {
    if (!rawData?.tables) return [];
    
    return rawData.tables.map(table => {
      if (!table.columns || !table.rows) return null;
      
      const labelColumn = table.columns[0]?.name;
      const labels = table.rows.map(row => row[labelColumn] || '');
      
      const datasets = table.columns.slice(1).map(col => ({
        label: col.name,
        data: table.rows.map(row => {
          const val = row[col.name];
          return typeof val === 'number' ? val : 0;
        })
      }));
      
      return {
        ...table,
        labels,
        datasets
      };
    }).filter(Boolean);
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/data`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const data = await response.json();
      const transformed = transformData(data);
      
      setTables(transformed);
      setSelectedTable(transformed[0] || null);
      setError(null);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message);
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  }, [transformData]);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    const socket = io(API_BASE_URL);
    
    socket.on("data-update", (data) => {
      const transformed = transformData(data);
      setTables(transformed);
      setSelectedTable(prev => transformed.find(t => t.name === prev?.name) || transformed[0] || null);
    });
    
    socket.on("connect_error", () => {
      setError("Realtime connection failed - using polling");
    });
    
    fetchData();
    
    return () => socket.disconnect();
  }, [fetchData, transformData]);

  // Render appropriate visualization
  const renderVisualization = useCallback((table) => {
    if (!table) return null;
    
    const commonProps = {
      key: table.name,
      name: table.name,
      labels: table.labels,
      datasets: table.datasets,
      darkMode
    };
    
    switch (table.type) {
      case "barChart":
        return <BarChart {...commonProps} />;
      case "lineChart":
        return <LineChart {...commonProps} />;
      case "pieChart":
        return <PieChart {...commonProps} />;
      case "scatterPlot":
        return <ScatterPlot {...commonProps} />;
      case "table":
        return <Table columns={table.columns} rows={table.rows} darkMode={darkMode} />;
      default:
        return <div>Unsupported chart type: {table.type}</div>;
    }
  }, [darkMode]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <TailSpin color={darkMode ? "#fff" : "#000"} height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
        <div className="text-xl mb-4">Error loading data</div>
        <div className="mb-6">{error}</div>
        <button 
          onClick={fetchData}
          className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600" : "bg-blue-500"} text-white`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        toggleChatWindow={() => setShowChat(!showChat)}
      />
      
      <div className="flex flex-1">
        <Sidebar
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          darkMode={darkMode}
          fullReportView={fullReportView}
          toggleFullReportView={() => setFullReportView(!fullReportView)}
        />
        
        <main className="flex-1 p-4 overflow-auto">
          {fullReportView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map(table => (
                <div key={table.name} className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
                  <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {table.name}
                  </h2>
                  {renderVisualization(table)}
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
              {selectedTable && (
                <>
                  <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {selectedTable.name}
                  </h2>
                  {renderVisualization(selectedTable)}
                </>
              )}
            </div>
          )}
        </main>
      </div>
      
      {showChat && (
        <ChatWindow
          onClose={() => setShowChat(false)}
          tables={tables}
          darkMode={darkMode}
        />
      )}
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;