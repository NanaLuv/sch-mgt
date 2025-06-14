const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/router");

const port = process.env.PORT;
const mongoURL = process.env.mongoURL;

const app = express();

//middleware
app.use(express.json());
// Configure CORS
const allowedOrigins = [
  "https://schools-management-system.vercel.app",
  "http://localhost:3000", // For development
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true, // If using cookies/auth
  })
);
app.use("/school", router);

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startServer();
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

function startServer() {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
