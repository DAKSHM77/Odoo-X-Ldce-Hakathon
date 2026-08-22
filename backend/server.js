require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));

// Middleware
app.use(express.json());

// Connect MongoDB Atlas
connectDB();

// Trip routes
app.use("/api/trips", tripRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Odoo Hackathon Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});