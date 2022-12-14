const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const connectDB = require('./config/db');
const mainRoutes = require('./routes/main');
const storiesRoutes = require('./routes/stories');

// load config
dotenv.config({ path: './config/config.env' });

// passport config
require('./config/passport')(passport);

connectDB();

const app = express();

app.use (cors());

// Body parser 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req,res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    } 
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};

// Handlebars helper
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

// Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname: '.hbs'
})
);
app.set('view engine', '.hbs');

// Session 
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
);

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global var
app.use(function (req,res,next) {
    res.locals.user = req.user || null
    next()
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Flash
app.use(flash());

// Routes
app.use('/', mainRoutes);
app.use('/stories', storiesRoutes);
app.use('/api/v1/stories', require('./routes/map'));


const PORT = process.env.PORT || 3000

app.listen(PORT,
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);


