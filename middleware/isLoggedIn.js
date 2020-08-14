module.exports = (req, res, next) => {
    if (!req.user){
        req.flash('Error', 'You must be signed to access this page')
        res.redirect('/auth/login')
    } else {
        next()
    }
}