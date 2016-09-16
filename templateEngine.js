var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;


app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

