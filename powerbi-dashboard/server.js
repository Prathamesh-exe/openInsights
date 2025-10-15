import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "powerbi-data.json");

// ----------------------------------
// Simulation logic
// ----------------------------------

const generateRandomUpdate = (originalData) => {
  if (!originalData || !originalData.tables) return originalData;

  const updatedData = JSON.parse(JSON.stringify(originalData)); // Deep clone

  updatedData.tables.forEach(table => {
    table._changes = { modifiedRows: {}, addedRows: [], removedRows: [] };

    switch (table.type) {
      case 'barChart':
      case 'lineChart':
        table.rows.forEach((row, rowIndex) => {
          const shouldModify = Math.random() > 0.3;
          if (shouldModify) {
            table.columns.forEach(col => {
              if (col.dataType === "number" && row[col.name] !== undefined) {
                const changeFactor = 0.5 + Math.random();
                const newValue = Math.round(row[col.name] * changeFactor);
                row[col.name] = newValue > 0 ? newValue : 0;
                table._changes.modifiedRows[rowIndex] = true;
              }
            });
          }
        });
        break;

      case 'pieChart':
        table.rows.forEach((row, rowIndex) => {
          row.Share = Math.round(Math.random() * 30 + 5);
          table._changes.modifiedRows[rowIndex] = true;
        });
        const newTotal = table.rows.reduce((sum, row) => sum + row.Share, 0);
        table.rows.forEach(row => {
          row.Share = Math.round((row.Share / newTotal) * 100);
        });
        break;

      case 'scatterPlot':
        table.rows.forEach((row, rowIndex) => {
          table.columns.forEach(col => {
            if (col.dataType === "number" && row[col.name] !== undefined) {
              const changeFactor = 0.2 + Math.random() * 1.8;
              row[col.name] = Math.round(row[col.name] * changeFactor);
              table._changes.modifiedRows[rowIndex] = true;
            }
          });
        });
        break;

      case 'table':
        if (Math.random() > 0.7 && table.rows.length > 3) {
          const removeIndex = Math.floor(Math.random() * table.rows.length);
          table.rows.splice(removeIndex, 1);
          table._changes.removedRows.push(removeIndex);
        }

        if (Math.random() > 0.7) {
          const newRow = {};
          table.columns.forEach(col => {
            if (col.dataType === "number") {
              newRow[col.name] = Math.round(Math.random() * 1000000);
            } else if (col.dataType === "string") {
              if (col.name === "Employee") {
                newRow[col.name] = `New Employee ${Math.floor(Math.random() * 100)}`;
              } else if (col.name === "Region") {
                const regions = ["North", "South", "East", "West", "New Region"];
                newRow[col.name] = regions[Math.floor(Math.random() * regions.length)];
              } else if (col.name === "TargetAchieved") {
                newRow[col.name] = Math.random() > 0.5 ? "Yes" : "No";
              } else {
                newRow[col.name] = `New ${col.name}`;
              }
            }
          });
          table.rows.push(newRow);
          table._changes.addedRows.push(table.rows.length - 1);
        }

        table.rows.forEach((row, rowIndex) => {
          if (Math.random() > 0.4) {
            table.columns.forEach(col => {
              if (col.dataType === "number" && row[col.name] !== undefined) {
                const changeFactor = 0.3 + Math.random() * 1.4;
                row[col.name] = Math.round(row[col.name] * changeFactor);
                table._changes.modifiedRows[rowIndex] = true;
              } else if (col.dataType === "string" && col.name === "TargetAchieved") {
                row[col.name] = row[col.name] === "Yes" ? "No" : "Yes";
                table._changes.modifiedRows[rowIndex] = true;
              }
            });
          }
        });
        break;

      default:
        table.rows.forEach((row, rowIndex) => {
          table.columns.forEach(col => {
            if (col.dataType === "number" && row[col.name] !== undefined) {
              const changeFactor = 0.7 + Math.random() * 0.6;
              row[col.name] = Math.round(row[col.name] * changeFactor);
              table._changes.modifiedRows[rowIndex] = true;
            }
          });
        });
    }
  });

  return updatedData;
};

const readDataFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error("Data file not found");
    }
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Error reading data file:", err);
    return null;
  }
};

const simulateAndBroadcast = () => {
  const currentData = readDataFile();
  if (!currentData) return;

  const updatedData = generateRandomUpdate(currentData);
  io.emit('data-update', updatedData);
  fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
  console.log('Manual data update sent to clients');
};

// ----------------------------------
// API ROUTES
// ----------------------------------

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is healthy" });
});

// Fetch current data
app.get("/api/data", (req, res) => {
  const data = readDataFile();
  res.json(data || { error: "Failed to load data" });
});

// ✅ NEW: Simulation trigger via HTTP POST
app.post("/api/simulate", (req, res) => {
  try {
    simulateAndBroadcast();
    res.status(200).json({ message: "Simulation triggered successfully" });
  } catch (err) {
    console.error("Simulation error:", err);
    res.status(500).json({ error: "Failed to simulate data" });
  }
});

// WebSocket
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit('data-update', readDataFile());

  socket.on("trigger-simulation", () => {
    console.log("Simulation triggered by client");
    simulateAndBroadcast();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Using data file: ${DATA_FILE}`);
});
