const uniqid = require('uniqid');

exports.newPost = (userId, postText, postImage) => {
    var postId = uniqid();
    var timestamp = new Date();
    
    const post = {
        _postId: postId,
        _userId: userId,
        _postText: postText,
        _postImage: postImage,
        _timestamp: timestamp
    };

    // call database handler

    if (post._postImage) newImagePost(post._postImage);
}

// Do I need to export this if newPost is being exported?
function newImagePost(image) {
    // db handler
}