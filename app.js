var express     = require('express'),
    app         = express(),
    request     = require('request'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seeds'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    passport    = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

    var commentRoutes = require('./routes/comments'),
    indexRoutes        = require('./routes/index'),
    campgroundRoutes  = require('./routes/campgrounds');

mongoose.connect('mongodb://ben:champion@ds063899.mlab.com:63899/yelpcamp');

app.set('view engine', 'ejs');

app.use(flash());

app.use(bodyParser.urlencoded({extended: true }));

app.use(express.static(__dirname + "/public"));

app.locals.moment = require('moment');

// PASSPORT SETUP

app.use(require('express-session')({
  secret: "Mia is a cat",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///

// seedDB();

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});


app.use(methodOverride("_method"));

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});
