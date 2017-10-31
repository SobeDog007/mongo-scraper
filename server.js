// Steven Sober
// 10/30/2017
// HW: mongo-scraper
// server.js

// Dependencies:
var express    = require("express");
var bodyParser = require("body-parser");
var logger     = require("morgan");
var mongoose   = require("mongoose");

// Models:
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Scraping Tools:
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises.
mongoose.Promise = Promise;

// Connection Port:
var port = process.env.PORT || 3000;

// Initialize Express:
var app = express();

// Use morgan and body parser with our app.
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

// Make public a static directory.
app.use(express.static("public"));

// DB configuration with Mongoose:
//mongoose.connect("mongodb://localhost/mongo_scraper_db");
mongoose.connect("mongodb://heroku_cbpkh3c6:gs4t0ojoeuur47bhi2pasulo3q@ds241895.mlab.com:41895/heroku_cbpkh3c6");
var db = mongoose.connection;

// Show any Mongoose errors:
db.on("error", function(error) {
  	console.log("Mongoose Error: ", error);
});

// Once logged in to the DB through Mongoose, log a success message.
db.once("open", function() {
  	console.log("Mongoose connection successful.");
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// A GET request to scrape the echojs website.
app.get("/scrape", function(req, res) {

  	// Grab the body of the html with request.
  	request("http://www.echojs.com/", function(error, response, html) {

    	// Load that into cheerio and save it to $ for a shorthand
    	// selector.
    	var $ = cheerio.load(html);

    	// Grab every h2 within an article tag, and do the following:
    	$("article h2").each(function(i, element) {

      	// Save an empty result object.
      	var result = {};

      	// Add the text and href of every link, and save them as properties
      	// of the result object.
      	result.title   = $(this).children("a").text();
      	result.link    = $(this).children("a").attr("href");
      	//result.summary = $(this).children();

      	// Using our Article model, create a new entry.
      	// This effectively passes the result object to the entry (and the
      	// title and link).
      	var entry = new Article(result);

      	// Save that entry to the DB.
      	entry.save(function(err, doc) {

        		// Log any errors.
        		if (err) {
          		console.log(err);
        		}

        		// Log the doc.
        		else {
          		console.log(doc);
        		}
      	});
    	});
  	});

  	// Tell the browser that we finished scraping the text.
  	res.send("Scrape Complete");
});

// --------------------------------------------------------------------------

// This will get the articles we scraped from the mongoDB.
app.get("/articles", function(req, res) {

  	// Grab every doc in the Articles array.
  	Article.find({}, function(error, doc) {

    	// Log any errors.
    	if (error) {
      	console.log(error);
    	}

    	// Send the doc to the browser as a JSON object.
    	else {
      	res.json(doc);
    	}
  	});
});

// --------------------------------------------------------------------------

// Grab an article by its ObjectId.
app.get("/articles/:id", function(req, res) {

  	// Using the ID passed in the "id" parameter, prepare a query that finds
  	// the matching one in our DB.
  	Article.findOne({ "_id": req.params.id })

  	// Populate all of the comments associated with it.
  	.populate("comment")

  	// Execute the query.
  	.exec(function(error, doc) {

    	// Log any errors.
    	if (error) {
      	console.log(error);
    	}

    	// Send the doc to the browser as a JSON object.
    	else {
      	res.json(doc);
    	}
  	});
});

// --------------------------------------------------------------------------

// Create a new comment or replace an existing comment.
app.post("/articles/:id", function(req, res) {

  	// Create a new comment and pass the req.body to the entry.
  	var newComment = new Comment(req.body);

  	// Save the new comment to the DB.
  	newComment.save(function(error, doc) {
  
    	// Log any errors.
    	if (error) {
      	console.log(error);
    	}

    	else {

      	// Use the article ID to find and update its comment.
      	Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })

      	// Execute the above query.
      	.exec(function(err, doc) {
      
        		// Log any errors
        		if (err) {
          		console.log(err);
        		}

        		// Send the document to the browser.
        		else {
          		res.send(doc);
        		}
      	});
    	}
  	});
});

// --------------------------------------------------------------------------

// Listen on Port 3000:
app.listen(port, function() {
  	console.log("App running on port 3000!");
});
