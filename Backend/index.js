const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const {jwtAuthMiddleware} = require('./jwt')

const app = express();


app.use(cors({
  origin: [
  "http://localhost:3000",
  "https://split-mate-2h84.vercel.app" 
],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


const users = require('./routes/User');
const groups = require('./routes/Groups');
const friends = require('./routes/Friends');
const expenses = require('./routes/Expenses');
const settlements = require('./routes/Settlements');
const balances = require('./routes/Balances')
const PORT = 3001;


app.use(express.json()); 
connectDB();

app.use('/api',users)
app.use('/api',jwtAuthMiddleware, groups)
app.use('/api',jwtAuthMiddleware, friends);
app.use('/api',jwtAuthMiddleware, expenses)
app.use('/api',jwtAuthMiddleware, settlements)
app.use('/api',jwtAuthMiddleware, balances)

app.get('/', (req, res) => {
    console.log("Get Handler");
    res.send("GET Request");
})

app.listen(PORT, ()=> {
    console.log("Server is Up");
})