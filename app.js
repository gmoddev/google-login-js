
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const { initPassport } = require('./config/passport-config');
const connection = require('./config/mysql-config');
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

initPassport(passport, connection);

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', dashboardRoute);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
