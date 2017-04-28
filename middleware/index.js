var middlewareObj = {},
Campground = require('../models/campground'),
Comment = require('../models/comment'),
user = require('../models/user');

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err){
        req.flash("error", "Campground not found");
        res.redirect('back');
      } else {
        if (foundCampground.owner.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if (err){
        req.flash("error", "I'm sorry, I can't find that comment");
      } else {
        if (foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else
  req.flash('error', 'You need to be logged in to do that');
  res.redirect("/login");
};

module.exports = middlewareObj;
