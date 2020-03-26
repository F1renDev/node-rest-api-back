const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const uuidv4 = require("uuid/v4");

const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, uuidv4());
  }
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.json());
//getting a single image with a name of 'image'
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//Serving the images folder statically
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error, ["app.js => error middleware"]);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://F1ren:qwe123@cluster0-lhqoo.mongodb.net/messages?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(success => {
    app.listen(8080);
  })
  .catch(err => console.log(err));

//   Instead of

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });
// which we'll write in the next lecture, you should use this slightly modified version:

// const uuidv4 = require('uuid/v4')

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function(req, file, cb) {
//         cb(null, uuidv4())
//     }
// });
// For this, install the uuid package by running:

// npm install --save uuid

// To ensure that images can be loaded correctly on the frontend, you should also change the logic in the feed.js controller:

// in createPosts, change the imageUrl const:

// exports.createPost = (req, res, next) => {
//     ...
//     const imageUrl = req.file.path.replace("\\" ,"/");
//     ...
// }
// and in updatePost (once we added that later):

// exports.updatePost = (req, res, next) => {
//     ...
//     imageUrl = req.file.path.replace("\\","/");
// }
