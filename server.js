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
const db = require('./models');

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

// Home Route
app.get('/', (req, res) => {
  let date = moment().format('YYYY-MM-DD')
  let todayURL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
  let galleryURL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=6`
  // Get astronmy picture of today
  axios.get(todayURL)
  .then( apodData => {
    //Get random 6 pictures for gallery
    axios.get(galleryURL)  
    .then(galleryData => {
      res.render('index', { 
        apod: apodData.data, 
        gallery: galleryData.data, 
        alerts: res.locals.alerts });
    })
    .catch(err => {
      console.log(err);
    })
  })
  .catch(err => {
    console.log(err);
  })
});

// Search 
app.get('/search', (req, res) => {
  let date = moment().format('YYYY-MM-DD')
  res.render('search', {date})
})

// Gallery
app.get('/gallery', (req, res) => {
  let galleryURL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=18`
  axios.get(galleryURL)  
  .then(galleryData => {
    res.render('gallery', { gallery: galleryData.data })
  })
  .catch(err => {
    console.log(err);
  })
})

// Mars
app.get('/Mars', (req, res) => {
  let yesterday = moment().subtract(1, "days").format('YYYY-MM-DD')
  let marsURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2020-08-01&api_key=${API_KEY}`
  axios.get(marsURL)  
  .then(marsData => {
    res.render('mars', { mars: marsData.data })
  })
  .catch(err => {
    console.log(err);
  })
})

// Detail GET
app.get('/detail', (req, res) => {
  let date = req.query.date
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
  axios.get(url)
  .then( apodData => {
    // get info from API
    // get comments from DB
    db.comment.findAll({
      where: {date: date},
      include: [db.user]        
    })
    .then(comments => {
        res.render('detail', {apod: apodData.data, comments})
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
    })
})

// Detail POST
// Add comment in Detail page
app.post('/detail', isLoggedIn, (req, res) => {
  let date = req.query.date
  let comment = req.body.comment
  let userId = req.user.id
  console.log(date, comment, userId);
  db.comment.create({
    date: date,
    content: comment,
    userId: userId
  }).then(() => {
    res.redirect(`/detail?date=${date}#comment`)
  })
})

app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'))

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
