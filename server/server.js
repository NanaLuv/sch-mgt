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
app.use(cors());
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
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
