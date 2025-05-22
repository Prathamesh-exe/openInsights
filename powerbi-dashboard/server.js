import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
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
const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";

// Path to your JSON data file
const DATA_FILE = path.join("C:", "Users", "HP", "Desktop", "powerbi-db", "powerbi-dashboard", "data", "powerbi-data.json");

// Validate and read data file
const readDataFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error("Data file not found");
    }
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(rawData);
    
    // Validate basic structure
    if (!data || !data.tables || !Array.isArray(data.tables)) {
      throw new Error("Invalid data structure");
    }
    
    return data;
  } catch (err) {
    console.error("Error reading data file:", err);
    return null;
  }
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is healthy" });
});

// Get current dashboard data
app.get("/api/data", (req, res) => {
  const data = readDataFile();
  if (!data) {
    return res.status(500).json({ error: "Failed to load data" });
  }
  res.json(data);
});

// Calculate summary stats for RAG
const calculateSummaryStats = (tables) => {
  return tables.map(table => {
    const numericColumns = table.columns.filter(col => col.dataType === "number");
    const stats = {};
    
    numericColumns.forEach(col => {
      const values = table.rows.map(row => row[col.name]).filter(val => typeof val === "number");
      if (values.length > 0) {
        stats[col.name] = {
          sum: values.reduce((a, b) => a + b, 0),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    
    return {
      tableName: table.name,
      rowCount: table.rows.length,
      stats
    };
  });
};

// Generate prompt for RAG
const generateRAGPrompt = (question, tables) => {
  const summaries = calculateSummaryStats(tables);
  
  let context = "Available Data Tables:\n";
  summaries.forEach(summary => {
    context += `\nTable: ${summary.tableName} (${summary.rowCount} rows)\n`;
    Object.entries(summary.stats).forEach(([col, stats]) => {
      context += `- ${col}: Sum=${stats.sum.toLocaleString()}, Avg=${stats.avg.toFixed(2)}, Min=${stats.min}, Max=${stats.max}\n`;
    });
  });
  
  return `You are a data analyst assistant. Use the following data summary to answer questions accurately.
  
${context}

Question: ${question}
Answer:`;
};

// Chat endpoint
app.post("/api/chat", rateLimit({
  windowMs: 60 * 1000,
  max: 10
}), async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const data = readDataFile();
    if (!data) {
      return res.status(500).json({ error: "Data not available" });
    }

    const prompt = generateRAGPrompt(question, data.tables);
    
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7
        }
      })
    });

    const result = await response.json();
    res.json({ answer: result[0]?.generated_text || "No response generated" });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Socket.IO for real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");
  
  // Send initial data
  const data = readDataFile();
  if (data) {
    socket.emit("data-update", data);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Loading data from: ${DATA_FILE}`);
});