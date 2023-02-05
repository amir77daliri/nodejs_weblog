const path = require('path');

const express = require('express');

const indexRoutes = require('./routes/index');

const app = express();

// View Engine :
app.set("view engine", "ejs");
app.set("views", "views");
// End View Engine Config

// Set Static
app.use(express.static(path.join(__dirname, "public")));

// Start routes
app.use(indexRoutes);
// End routes

app.listen(3000, () => console.log("Server running on port 3000..."))

