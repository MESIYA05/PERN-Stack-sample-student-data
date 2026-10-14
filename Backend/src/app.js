const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Karkkai API is running" });
});

app.use("/api/students", studentRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) return next(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;