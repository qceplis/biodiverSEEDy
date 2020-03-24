exports.newPost = (req) => {
    const post = {
        userId: userId,
        postText: postText,
        postImage: postImage
    };

    // call database handler

    if (post.image) newImagePost(post.image);
}

// Do I need to export this if newPost is being exported?
function newImagePost(image) {
    // db handler
}