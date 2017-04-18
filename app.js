var express     = require('express'),
    app         = express(),
    request     = require('request'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seeds'),
    Comment     = require('./models/comment');

mongoose.connect('mongodb://localhost/yelp_camp');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));

seedDB();

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

app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});
