const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // load .env variables
connectDB();     // connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON requests

app.get("/", (req, res) => {
  res.send("Welcome to LeadNest Backend 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
