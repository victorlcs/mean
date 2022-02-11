const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
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
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
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
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update Successful" });
      }else {
        res.status(401).json({ message: "Not authorized!" });
      }
      
    });
  }
);

router.get("", (req, res, next) => {
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
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found !" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator:req.userData.userId }).then((result) => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful" });
    }else {
      res.status(401).json({ message: "Not authorized!" });
    }
  });
});

module.exports = router;
