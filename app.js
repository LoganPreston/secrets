//jshint esversion:6

//required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//express and ejs setup
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose setup
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("user", userSchema);

//GET requests

//home
app.get("/", function (req, res) {
  res.render("home");
});

//login
app.get("/login", function (req, res) {
  res.render("login");
});

//register
app.get("/register", function (req, res) {
  res.render("register");
});

//POST requests

//login
app.post("/login", function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    }
    //no error
    else {
      bcrypt.compare(req.body.password,user.password,function(err,same){
          if (same){
            res.render("secrets");
          } else{
            res.redirect("/login");
          }
      });
    }
  });
});

//register
app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      username: req.body.username,
      password: hash
    });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        res.render("secrets");
      }
    });
  });
});

//listen on to port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
