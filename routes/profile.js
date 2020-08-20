const express = require('express');
const router = express.Router();
const db = require('../models')
const methodOverride = require('method-override');
const isLoggedIn = require('../middleware/isLoggedIn');

router.use(methodOverride('_method'));

// Profile 
// Display user's faves pictures and comments
router.get('/', isLoggedIn, (req, res) => {
    let userName = req.user.name;
    db.user.findOne({
        where: {id: req.user.id},
        include: [db.fave, db.comment]
    })
    .then(user =>{
        res.render('profile/profile', {userName, user});
    })
    .catch(err => {
        console.log(err);
    })
});

// [Add to Favorite] form in Detail Page
// Add date&url to faves, related with user
router.post('/', isLoggedIn, (req, res) => {
    let date = req.body.date
    let url = req.body.url
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

// delete the picture in profile collection
router.delete('/:id', isLoggedIn, (req, res) => {
    // db.user.findOne({
    //     where: {id: req.user.id}
    // })
    // .then(user => {
        db.fave.destroy({
            where: {id: req.params.id}
        })
        .then(() => {
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(err);
        })
    // })
    // .catch(err => {
    //     console.log(err);
    // })
})

// delete the comment in profile comments check if also delete in detail page
router.delete('/comment/:id', (req, res) => {
    db.comment.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        res.redirect('/profile#comments')
    })
})

module.exports = router;
