//jshint esversion:6

//required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//don't need to expose passport-local

//express and ejs setup
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//express-session setup, cookies
app.use(
  session({
    secret: "Thisisasecretstring",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); //passport init
app.use(passport.session()); //init session

//mongoose setup
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//passport-local-mongoose
userSchema.plugin(passportLocalMongoose); //hash and salt and save to db. heavy lift.

const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());
//need below two lines for cookies
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

//POST requests

//login
app.post("/login", function (req, res) {
  const loginUser = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(loginUser, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

//register
app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

//listen on to port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
