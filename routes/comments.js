var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');
var middleware = require('../middleware');


router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, data){
    if (err) {
      console.log(error);
    } else {
      res.render("comments/new", {campground: data});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res){
  Comment.create(req.body.comment, function(error, comment){
    if (error){
      console.log(error);
      res.redirect("/campgrounds");
    } else {
      Campground.findById(req.params.id, function(error, campground){
        if (error){
          console.log(error);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save(function(err, data){
            if (error){
              console.log(error);
            } else {
              req.flash("success", "Comment successfully saved");
              res.redirect("/campgrounds/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      console.log(err);
    } else {
      res.render('comments/edit', {comment: foundComment, campground_id: req.params.id});
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Comment successfully changed");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      res.redirect("back");
    } else {
      req.flash("success", "Your comment has been successfully removed");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


module.exports = router;
