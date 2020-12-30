//jshint esversion:6

//required modules
const express = require("express");
const bodyParser = require("body-parser");

//express and ejs setup
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//listen on to port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
