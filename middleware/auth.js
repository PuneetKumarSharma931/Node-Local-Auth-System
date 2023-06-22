module.exports = {
    ensureAuth: (req, res, next) => {

        if(req.isAuthenticated()) {

            next();
        }
        else {

            if((req.baseUrl + req.path) == '/auth/logout') {

                req.flash('error_msg', 'register/login first to do that action!');
                return res.redirect('/');
            }

            req.flash('error_msg', 'Please register/login to continue to dashboard!');

            res.redirect('/');
        }
    },
    ensureGuest: (req, res, next) => {

        if(req.isAuthenticated()) {

            req.flash('success_msg', 'You are already registered/logged in!');
            res.redirect('/dashboard');
        }
        else {

            next();
        }
    }
}