const express = require('express');
const router = express.Router();
const db = require('../models')
const methodOverride = require('method-override');
const isLoggedIn = require('../middleware/isLoggedIn');

router.use(methodOverride('_method'));

// Profile 
router.get('/', isLoggedIn, (req, res) => {
    let userName = req.user.name;
    db.user.findOne({
        where: {id: req.user.id}
    })
    .then(user =>{
        user.getFaves()
        .then(faves => {
            res.render('profile/profile', {userName, faves});
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
});

// Add to Favorite form, add date&url to faves, related with user
router.post('/', isLoggedIn, (req, res) => {
    let date = req.body.date
    let url = req.body.url
    // console.log(date, url);
    db.user.findOne({
        where: {id: req.user.id }
    })
    .then(user => {
        db.fave.findOrCreate({
            where: {
                date: date,
                url: url
            }
        })
        .then(([fave, created]) => {
            console.log(created);
            user.addFave(fave)
            .then(newRelationship => {
                console.log('New Relationship');
                console.log(newRelationship);
                res.redirect('/profile')
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

// delete the picture in profile 
router.delete('/:id', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {id: req.user.id}
    })
    .then(user => {
        db.fave.destroy({
            where: {id: req.params.id}
        })
        .then(fave => {
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

// show
router.get('/:id', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {id: req.user.id}
    })
    .then(user => {
        db.fave.findOne({
            where: {id: req.params.id}
        })
        .then(fave =>{
            res.render('profile/show', {fave})
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})


module.exports = router;
