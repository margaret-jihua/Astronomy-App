const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const db = require('../models')
/* Passport "serialize" your info make it easier to login */

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

//take id took taht up in db
passport.deserializeUser((id, cb) => {
    cb(null, id)
    .catch(cb())
})

passport.use(new localStrategy ({
    usernameField: 'email',
    passwordField: 'password'
    }, (email, passwprd, cb) => {
    db.user.findOne({
        where: { email }
    })
    .then(user =>{
        if (!user || !user.validPassword(passwprd)){
            cb(null, false)
        } else {
            cb(null, user)
        }
    })
    .catch(cb())
}))

module.exports = passport