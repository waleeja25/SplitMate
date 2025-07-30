const express = require('express');
const connectDB = require('./db');
const app = express();
const PORT = 3001;


app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    console.log("Get Handler");
    res.send("GET Request");
})

app.listen(PORT, ()=> {
    console.log("Server is Up");
})