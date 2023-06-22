const express  = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

//Loading Config
dotenv.config({ path: './config/config.env' });

//Connecting to DB
connectDB();

//Loading Passport Strategy
require('./config/passport')(passport);

//Body Parser
app.use(express.urlencoded( { extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express Sessions
app.use(session({
    secret: 'local authentication',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI })
}));

//flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

//Initializing Passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.listen(PORT, ()=>{

    console.log(`Server is running on port ${PORT}`);
});

