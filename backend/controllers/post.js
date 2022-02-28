const Post = require("../models/post");

exports.insertPost = (req, res, next) => {
    //multer is a middleware for this route
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((result) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: result._id,
          title: res.title,
          content: res.content,
          imagePath: res.imagePath,
        },
      });
    }).
    catch(error => {
      res.status(500).json({
        message: "Creating post failed!"
      })
    });
  };

exports.updatePost =  (req, res, next) => {
    let imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: req.body.imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
        console.log(req.params.id);
        console.log(req.userData.userId);
        console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update Successful" });
      }else {
        res.status(401).json({ message: "Not authorized!" });
      }
      
    })
    .catch(error => {
      res.status(500).json({
        message: "Update post failed!"
      })
    });
  };

exports.deletePost = (req, res, next) => {
  console.log(req.query.imagepath);
Post.deleteOne({ _id: req.params.id, creator:req.userData.userId}).then((result) => {
    console.log(result);
    if (result.deletedCount > 0) {
    res.status(200).json({ message: "Deletion Successful" });
    }else {
    res.status(401).json({ message: "Not authorized!" });
    }
})
.catch(error => {
    res.status(500).json({
    message: "Delete post failed!"
    })
});
};

exports.getPosts = (req, res, next) => {
    console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && !isNaN(currentPage)) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
      .then((documents) => {
        fetchedPosts = documents;
        return Post.count();
      })
      .then((counts) => {
        res.status(200).json({
          message: "post successfully",
          posts: fetchedPosts,
          maxPosts: counts,
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching posts failed!"
        })
      });
  };

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found !" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    });
  };

