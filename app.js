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
    LocalStrategy = require('passport-local');

mongoose.connect('mongodb://localhost/yelp_camp');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));

app.use(express.static(__dirname + "/public"));

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

seedDB();

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err) {
      console.log("There was a problem getting the campgrounds");
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log("There has been an error");
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, data){
    if (err) {
      console.log(error);
    } else {
      res.render("comments/new", {campground: data});
    }
  });
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  Campground.create({
    name: name,
    image: image,
    description: description
  }, function(err, campground){
      if (err) {
        console.log("There was a problem with your request");
      } else {
        console.log("Your campground was saved to the database");
      }
    });
  res.redirect("/campgrounds");
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  Comment.create(req.body.comment, function(error, comment){
    if (error){
      console.log(error);
      res.redirect("/campgrounds");
    } else {
      Campground.findById(req.params.id, function(error, campground){
        if (error){
          console.log(error);
        } else {
          campground.comments.push(comment);
          campground.save(function(err, data){
            if (error){
              console.log(error);
            } else {
              console.log("Comment successfully saved");
              res.redirect("/campgrounds/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

/// Auth Routes

app.get('/register', function(req, res){
  res.render("users/register");
});

app.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err){
      return res.render('users/register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});

app.get("/login", function(req, res){
  res.render("users/login");
});

app.post("/login", passport.authenticate('local',
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else
  res.redirect("/login");
}
