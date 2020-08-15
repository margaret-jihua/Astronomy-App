require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const axios = require('axios')
const moment = require('moment')
const session = require('express-session')
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.NASA_API_KEY
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const app = express();
// require the authorization middleware at the top of the page
const isLoggedIn = require('./middleware/isLoggedIn');
const { response } = require('express');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// secret: What we giving user to use our site
// resave: Save the session even if it's modifiedm make it false
// saveUnintialized: if we have a new session, we will save it, thus, setting to true
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
// flash for temporary messages
app.use(flash())

//middleware to show alerts for every view
app.use ((req, res, next) => {
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', (req, res) => {
  let date = moment().format('YYYY-MM-DD')
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
  axios.get(url)
  .then(response => {
    res.render('index', { apod: response.data, alerts: res.locals.alerts });
  })
  .catch(err => {
    console.log(err);
  })
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
