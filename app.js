var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var campgrounds = [
                  {name: "Salmon Creek", image: 'https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg'},
                  {name: "Epsom Place", image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
                  {name: "Another Camp", image: 'https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg'}
                  ];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  campgrounds.push({name: name, image: image});
  res.redirect("/campgrounds");
});




app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});
