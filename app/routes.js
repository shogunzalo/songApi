// app/routes.js
var viewRoute = "./views/";

module.exports = function(app, passport) {


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    //app.get('/admin', function(req,res){
    //    res.sendfile(viewRoute + '/admin.html');
    //});

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    // app.get('/login', function(req, res) {

    //     // render the page and pass in any flash data if it exists
    //     res.render('/views/login.html', { message: req.flash('loginMessage') }); 
    // });
    
    app.get('/', function(req, res) {
        res.sendfile(viewRoute + '/login.html');// load the index.ejs file
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/test', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    //show the signup form
    //app.get('/signup', function(req, res) {
    //
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    //});
    //app.get('/signup', function(req, res) {
    //    res.sendfile(viewRoute + '/signup.html');// load the index.ejs file
    //});
    //
    //// process the signup form
    //app.post('/signup', passport.authenticate('local-signup', {
    //    successRedirect : '/admin', // redirect to the secure profile section
    //    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    //    failureFlash : true // allow flash messages
    //}));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    //app.get('/admin', isLoggedIn, function(req, res) {
    //    //var options = {
    //    //    headers: {
    //    //        user : req.user.toString(),
    //    //        'x-timestamp': Date.now(),
    //    //        'x-sent': true
    //    //    }
    //    //};
    //    res.sendfile(viewRoute + '/admin.html', { user : req.user });// get the user out of session and pass to template
    //    //res.sendfile();
    //    console.log(req.user);
    //});

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/home');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/home');
}
