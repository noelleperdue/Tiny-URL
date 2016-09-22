"use strict"

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const methodOverride = require("method-override");
const bodyParser = require("body-parser"); //
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded());

app.set("view engine", "ejs");

let collection;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log('Could not connect! Unexpected error, details below.');
    cb(err);
    return;
  }
  collection = db.collection("urls");
});


function generateRandomString() {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function getLongURL(shortURL, cb) {
  console.log(shortURL);
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.log('Could not connect! Unexpected error, details below.');
      cb(err);
      return;
    }
    let query = { "shortURL": shortURL };
    db.collection("urls").findOne(query, cb);
  });
}

function update(shortURL, longURL, cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.log('Could not connect! Unexpected error, details below.');
      cb(err);
      return;
    }
    db.collection("urls").updateOne({"shortURL": shortURL}, {"$set": {"longURL" : longURL}}, cb);
  });
}

function deleteURL(cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.log('Could not connect! Unexpected error, details below.');
      cb(err);
      return;
    }
    db.collection("urls").findOneAndDelete(cb);
  });
}

app.get("/", (req, res) => {
  res.redirect("/urls/new");
});

app.get("/u/:id", (req, res) => {
  collection.findOne({shortURL: req.params.id}, (err, url) => {
    res.redirect(url.longURL);
  });
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.id
  update(shortURL, longURL, (renderNew) => {
    res.redirect("/urls");
  });
});

app.get("/urls", (req, res) => {

  collection.find().toArray( (err, URLlist) => {
    if (err) {
      console.log("failed");
    }
    let templateVars = {
      URLlist : URLlist
    };
    res.render("urls_index", templateVars);
  } );

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {

  collection.findOne({shortURL: req.params.id}, (err, url) => {
    console.log(url);
    if (err) {
      console.log("failed");
    };
    let templateVars = {
      shortURL : url.shortURL,
      longURL : url.longURL
    };
    res.render("urls_show", templateVars);
  });
});


app.delete("/urls/:id", (req, res) => {
  collection.findOneAndDelete({shortURL: req.params.id})
  res.redirect("/urls");
});


app.get("/urls/:id", (req, res) => {
  collection.findOne({shortURL: req.params.id}, (err, url) => {
    res.render("urls_show", url);
  });
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  collection.findOne({'longURL': longURL}, (err, url) => {
    if (url) {
      console.log("I already have this URL:", url)
      res.redirect("urls");
    }
    else {
      collection.insert({'shortURL': shortURL, 'longURL': longURL}, (err, url) => {
        if (err) {
          console.log('Could not connect! Unexpected error, details below.');
        }
        else {
          res.redirect("/urls", url);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
