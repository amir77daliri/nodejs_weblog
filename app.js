const path = require('path');

const express = require('express');
const dotEnv = require('dotenv');

const connectDB = require('./config/db');
const indexRoutes = require('./routes/index');


// Load Config --> 
dotEnv.config({path: "./config/config.env"})
// 


// DataBase connection
connectDB();

const app = express();


// View Engine :
app.set("view engine", "ejs");
app.set("views", "views");
// End View Engine Config


// Set Static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules", "bootstrap-v4-rtl", "dist")))
app.use(express.static(path.join(__dirname, "node_modules", "font-awesome")))


// Start routes
app.use(indexRoutes);
// End routes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`))

