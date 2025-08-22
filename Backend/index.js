const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const {jwtAuthMiddleware} = require('./jwt')
const dotenv = require('dotenv');
const fetch = require("node-fetch");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  // origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); 


app.use(express.json()); 

const users = require('./routes/User');
const groups = require('./routes/Groups');
const friends = require('./routes/Friends');
const expenses = require('./routes/Expenses');
const settlements = require('./routes/Settlements');
const balances = require('./routes/Balances')
const PORT = 3001;


app.use((req, res, next) => {
  console.log("Incoming request path:", req.path);
  next();
});


app.use('/api',users)
app.use('/api',jwtAuthMiddleware, groups)
app.use('/api',jwtAuthMiddleware, friends);
app.use('/api',jwtAuthMiddleware, expenses)
app.use('/api',jwtAuthMiddleware, settlements)
app.use('/api',jwtAuthMiddleware, balances)

app.get("/ip-check", async (req, res) => {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();

    console.log("Server outbound IP:", data.ip); // will show in your console/logs

    res.json({
      outboundIP: data.ip,
    });
  } catch (err) {
    console.error("Error fetching IP:", err);
    res.status(500).json({ error: "Failed to fetch IP" });
  }
});


app.get('/', (req, res) => {
    console.log("Get Handler");
    res.send("GET Request");
})

// app.listen(PORT, ()=> {
//     console.log("Server is Up");
// })


module.exports = app;