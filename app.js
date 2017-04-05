var express     = require('express'),
    app         = express(),
    request     = require('request'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');

app.set('view engine', 'ejs');

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//     name: "Epsom Place",
//     image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg',
//     description: "A lovely place in the middle of Surrey. No beach though!"
//   }, function(err, campground){
//   if (err){
//     console.log("Oh no there has been an error");
//   } else {
//     console.log("The campground has been saved to the database");
//     console.log(campground);
//   }
// });

app.use(bodyParser.urlencoded({extended: true }));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err) {
      console.log("There was a problem getting the campgrounds");
    } else {
      res.render("index", {campgrounds: campgrounds});
    }
  });
});

app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err) {
      console.log("There has been an error");
    } else {
      res.render("show", {campground: foundCampground});
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




app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});
