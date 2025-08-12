const express = require('express');
const connectDB = require('./db');
const {jwtAuthMiddleware} = require('../jwt')

const app = express();

const users = require('./routes/User');
const groups = require('./routes/Groups');
const friends = require('./routes/Friends');
const expenses = require('./routes/Expenses');
const settlements = require('./routes/Settlements');

const PORT = 3001;


app.use(express.json()); 
connectDB();

app.use('/api',users)
app.use('/api',jwtAuthMiddleware, groups)
app.use('/api',jwtAuthMiddleware, friends);
app.use('/api',jwtAuthMiddleware, expenses)
app.use('/api',jwtAuthMiddleware, settlements)

app.get('/', (req, res) => {
    console.log("Get Handler");
    res.send("GET Request");
})

app.listen(PORT, ()=> {
    console.log("Server is Up");
})