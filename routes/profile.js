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
        res.status(404).render('404')
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

// Delete the picture in profile collection
// by deleteling the association in usersFaves table
router.delete('/:id', isLoggedIn, (req, res) => {
    db.usersFaves.destroy({
        where: {
            faveId: req.params.id,
            userId: req.user.id
        }
    })
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err);
    })    
})

// Delete the comment in profile comments 
// Check if also delete in detail page
router.delete('/comment/:id', (req, res) => {
    db.comment.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        res.redirect('/profile#comments')
    })
    .catch(err => {
        console.log(err);
    })
})

// Edit page to get new username
router.get('/edit', isLoggedIn, (req, res) => {
    db.user.findOne({
        where:{ id: req.user.id }
    })
    .then(user => {
        res.render('profile/edit', {user})
    })
    .catch(err => {
        console.log(err);
        res.status(404).render('404')
    })
})


// PUT method to update user's name in database
router.put('/edit/:id', isLoggedIn, (req, res) => {
    db.user.update(
        { name: req.body.newUserName}, 
        { where: { id: req.params.id }    
    })
    .then(userNameChanged => {
        console.log(userNameChanged);
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;
