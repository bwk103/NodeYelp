var express = require('express');
var app = express();
var request = require('request');
var campgrounds = [
                  {name: "Salmon Creek", image: 'https://cspafford.files.wordpress.com/2011/04/salmon-creek-1.jpg'},
                  {name: "Epsom Place", image: 'https://media.pitchup.co.uk/images/4/image/private/s--e0MM3PST--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1475496871/lee-valley-camping-and-caravan-park/x188855.jpg.pagespeed.ic.7TSawu-8t1.jpg'},
                  {name: "Another Camp", image: 'http://1.bp.blogspot.com/-Kdiea2X41mM/Tf4PdkiFKiI/AAAAAAAAAOo/eMzfWeUBjK8/s1600/boules251295_10150212499241884_632581883_7730056_1508512_n.jpg'}
                  ];

app.set('view engine', 'ejs');

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});




app.listen(3000, process.env.IP, function(){
  console.log("YelpCamp is running.....");
});
