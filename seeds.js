var mongoose = require('mongoose');
var Campground = require('./models/campground.js');
var Comment = require('./models/comment.js');

var data = [
  {
   name: "Whimple",
   image: "https://farm3.staticflickr.com/2365/1544775870_cb786d4a7e.jpg",
   description: "A very quiet place in East Devon"
 },
 {
  name: "Honiton",
  image: "https://farm1.staticflickr.com/319/31290106480_50a99b4867.jpg",
  description: "Not a village but not really a town"
},
{
 name: "Exeter",
 image: "https://farm9.staticflickr.com/8581/15840102524_500c49a2d5.jpg",
 description: "A city, but still nice when the sun is shining"
}
];

function seedDB(){
  Campground.remove({}, function(error){
  //   if (error){
  //     console.log(error);
  //   } else {
  //     console.log("Removed Campgrounds");
  //     data.forEach(function(seed){
  //       Campground.create(seed, function(error, campground){
  //         if (error){
  //           console.log(error);
  //         } else {
  //           console.log("Campground has been added");
  //           Comment.create({
  //             text: "This place is great but I wish there was internet",
  //             author: "Ben"
  //           }, function(error, comment){
  //             if (error){
  //               console.log(error);
  //             } else {
  //               campground.comments.push(comment);
  //               campground.save(function(error, data){
  //                 if (error) {
  //                   console.log(error);
  //                 } else {
  //                   console.log("Created new comment");
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     });
  //   }
  });
}

module.exports = seedDB;
