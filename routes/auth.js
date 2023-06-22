const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

let errors = [];

// @desc Render register page
// @route GET /auth/register

router.get('/register', ensureGuest, (req, res) => {

    res.render('register');
});

// @desc Render login page
// @route GET /auth/login

router.get('/login', ensureGuest, (req, res) => {

    res.render('login');
});

// @desc Handle register request
// @route POST /auth/register

router.post('/register', async (req, res) => {

    errors = [];

    const { name, email, password, confirmPassword } = req.body;

    if( !name || !email || !password || !confirmPassword ) {

        errors.push( { msg: "Please fill all the required fields!" });
    }

    if( password != confirmPassword ) {

        errors.push( { msg: "Password and confirm password must be same to continue"});
    }

    if(errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        });

        return;
    }

    
    try {
        
        let user = await User.findOne({ email: email });

        if(user) {

            errors.push({ msg: "This email is already registered!"});

            res.render('register', {
                errors,
                name,
                email,
                password,
                confirmPassword
            });

            return;
        }
        else {

            const newUser = new User({
                name,
                email,
                password
            });

            const user = await User.create(newUser);

            req.flash('success_msg', 'You are successfully registered and can login!');
            
            res.redirect('/auth/login');

        }

    } catch (error) {
        
        errors.push({ msg: "Some internal server error occured!" });
        console.log(error);

        res.render('register', {

            errors,
            name,
            email,
            password,
            confirmPassword
        });

        return;
    }

});

// @desc Handle Login Request
// @route POST /auth/login

router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true}), (req, res) => {

    req.flash('success_msg', 'You are successfully logged in!');
    res.redirect('/dashboard');
});

// @desc Handle Logout Request
// @route GET /auth/logout

router.get('/logout', ensureAuth, (req, res) => {

   req.logout({ keepSessionInfo: false}, (error) => {

        if(error) {

            req.flash('error_msg', 'Something went wrong!');

            return res.redirect('/dashboard');
        }

        req.flash('success_msg', 'You are successfully logged out!');

        res.redirect('/auth/login');
   });

});

module.exports = router;