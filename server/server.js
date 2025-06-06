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

mongoose
  .connect(mongoURL)
  .then((result) => {
    console.log("Database connected successfully");
    app.listen(port, () => console.log(`server listening on port ${port}`));
  })
  .catch((error) => console.log(error));
