const express = require("express"),
  Post = require("../models/Post");
var router = express.Router();

/*
    User adds new post 
    [HttpPost] 
    Parameters - UserID - Text content - Image
*/
router.post(
  "/new",
  /* authentication */ (req, res) => {
    // req validation needed

    var userId = req.body.userId,
      postText = req.body.postText;
    postImage = req.body.postImage;

    Post.newPost(userId, postText, postImage);
  }
);
/*
    User can view seed post 
    [HttpGet] 
    Parameter - PostID 
    Get - Post’s text content - Post’s photo 

    User can view seed post according to tag
    [HttpGet] 
    Parameters - species tags
    Get - Post’s text content - Post’s photo
*/

module.exports = router;
