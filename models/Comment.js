// Steven Sober
// 10/30/2017
// HW: mongo-scraper
// Comment.js

// Require Mongoose:
var mongoose = require("mongoose");

// Create the Schema class.
var Schema = mongoose.Schema;

// Create the Comment schema.
var CommentSchema = new Schema({

	// Title is a string.
  	title: {
    	type: String
  	},

  	// Body is a string.
  	body: {
    	type: String
  	}
});

// Create the Comment model with the CommentSchema.
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;
