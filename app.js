const path = require('path');

const debug = require('debug')("my-weblog");
const express = require('express');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const dotEnv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const connectDB = require('./config/db');


// Load Config --> 
dotEnv.config({path: "./config/config.env"})
// 
// DataBase connection
connectDB();
debug("connected to mongodb")

// passport configuration
require('./config/passport');

const app = express();


// View Engine :
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/mainLayout");
app.set("views", "views");
// End View Engine Config

// BodyParser
app.use(express.urlencoded({extended: false}));

// Set Static
app.use(express.static(path.join(__dirname, "public")));

// Session && Flash 
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(flash());  // req.flash


// initalize passport --> 
app.use(passport.initialize());
app.use(passport.session())


// Start routes
app.use('/', require('./routes/blog'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/users', require('./routes/users'));

app.use((req, res) => {
    res.render('404', {
        pageTitle: "صفحه یافت نشد || 404",
        path: '/404'
    })
})
// End routes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`))

