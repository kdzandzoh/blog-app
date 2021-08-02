const express = require('express')
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const mongoose = require('mongoose')
const usersRouter = require('./routes/users')
const indexRouter = require('./routes/index')
const postRouter = require('./routes/posts')

require('dotenv').config();
require('./passport')(passport);

const uri = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

//Session
app.use(session ({
  secret: 'super-secret-secret-that-no-one-will-ever-get',
  resave: true,
  saveUninitialized: true,
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.failure_msg = req.flash('failure_msg');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

//Database
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB has been connected')
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/posts', postRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));