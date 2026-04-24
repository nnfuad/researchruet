const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("ResearchRUET API running");
});

module.exports = app;