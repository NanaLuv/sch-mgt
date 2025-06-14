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
const corsOptions = {
  origin: [
    "https://schools-management-system-jys55fo0o-nana-loves-projects.vercel.app", //  Vercel URL
    "http://localhost:3000", //  local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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
