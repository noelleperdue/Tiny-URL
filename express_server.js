"use strict"

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const methodOverride = require("method-override");
const bodyParser = require("body-parser"); //

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded());

app.set("view engine", "ejs");


function generateRandomString() {
    var text = " ";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};

app.get("/", (req, res) => {
  res.end("Hello!");
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
 // console.log(req.body.longURL);  // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});


app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// app.post("/urls/:whatever", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// })

app.post("/urls/:id", (req, res) => {
  var shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
