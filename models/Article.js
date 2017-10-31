// Steven Sober
// 10/30/2017
// HW: mongo-scraper
// Article.js

// Require Mongoose:
var mongoose = require("mongoose");

// Create the Schema class:
var Schema = mongoose.Schema;

// Create the Article schema.
var ArticleSchema = new Schema({

  	// Title is a required string.
  	title: {
    	type: String,
    	required: true
  	},

  	// Summary is a required string.
  	// summary: {
  	// 	type: String,
  	// 	required: true
  	// },

  	// Link is a required string.
  	link: {
    	type: String,
    	required: true
  	},

  // This only saves one comment's ObjectId, ref refers to the Comment model.
  	comment: {
    	type: Schema.Types.ObjectId,
    	ref: "Comment"
  	}
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
