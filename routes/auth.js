const express = require('express');
const router = express.Router();
const db = require('../models')
const passport = require('../config/ppConfig')

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then (([user, created]) => {
    if (created){
      console.log(`${user.name} was created`);
      // FLASH MESSAGE
      passport.authenticate('local', {
        successRedirect:'/',
        successFlash: 'Account created and logging in'
      })(req, res)
      // before passport
      // res.redirect('/')
    }
    else {
      // email exist
      console.log('email already exist');
      // FLASH 
      req.flash('error','Email already exist. Please try again.')
      res.redirect('/auth/signup')
    }
  })
  .catch(err => {
    console.log(err);
    req.flash(`error`, `Error, unfortunately... ${err}`)
    res.redirect('/auth/signup')
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back.',
  failureFlash: 'Either email or password is incorrect, please try again.'
}))

router.get('/logout', (req,res) => {
  req.logOut();
  req.flash('success', 'See you again soon. Logging out')
  res.redirect('/')
})

module.exports = router;
