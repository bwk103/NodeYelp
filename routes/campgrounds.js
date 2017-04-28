var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var geocoder = require('geocoder');

router.get("/", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds, page: 'campgrounds'});
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(process.env.GMAPS);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;
  var owner = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function(err, data){
    if (err){
      console.log(err);
    } else {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newCampground = {
        name: name,
        image: image,
        price: price,
        description: description,
        owner: owner,
        lat: lat,
        lng: lng,
        location: location
      };
      Campground.create(newCampground, function(err, campground){
          if (err) {
            console.log(err);
          } else {
            req.flash("success", "Your campground has been added successfully");
            res.redirect("/campgrounds");
          }
        });
    }
  });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err){
      res.redirect('/campgrounds');
    } else {
      res.render('campgrounds/edit', {campground: foundCampground});
    }
  });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function(err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, owner: req.body.owner, location: req.body.location, lat: req.body.lat, lng: req.body.lng};
  });
  Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
    if (err){
      req.flash("error", "Due to an error your changes did not save. Please try again");
      res.redirect('/campgrounds/' + req.params.id);
    } else {
      req.flash("success", "Your changes have been saved successfully");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      req.flash("success", "Your campground has been successfully deleted");
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
