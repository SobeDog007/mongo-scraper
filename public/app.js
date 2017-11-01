// Steven Sober
// 10/30/2017
// HW: mongo-scraper
// app.js



// When user clicks the name sort button, display the table sorted by name
$("#scrape-btn").on("click", function() {

  // Do an api call to the back end for json with all animals sorted by name
  $.getJSON("/scrape", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
});

// When user clicks the "List Articles" button, display articles.
$("#articles-btn").on("click", function() {

	// Grab the articles as a JSON.
	$.getJSON("/articles", function(data) {

  		// Loop through the articles.
  		for (var i = 0; i < data.length; i++) {

    		// Display the information on the page.
    		$("#articles").append("<p data-id='" + data[i]._id + "'>" + 
    			data[i].title + "<br />" + data[i].link + "</p>");
  		}
	});
});

// Whenever someone clicks a p tag...
$(document).on("click", "p", function() {

  	// Empty the comments from the comment section
  	$("#comments").empty();
  	// Save the id from the p tag
  	var thisId = $(this).attr("data-id");

  	// Now make an ajax call for the Article.
  	$.ajax({
    	method: "GET",
    	url: "/articles/" + thisId
  	})

   // With that done, add the comment information to the page
   .done(function(data) {

   	console.log(data);

      // The title of the article:
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title:
   	$("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new comment body:
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new comment, with the ID of the article saved to it.
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // If there's a comment in the article...
      if (data.comment) {

        	// Place the title of the comment in the title input.
        	$("#titleinput").val(data.comment.title);
        	// Place the body of the comment in the body text area.
        	$("#bodyinput").val(data.comment.body);
      }
   });
});

// When you click the savecomment button...
$(document).on("click", "#savecomment", function() {

  	// Grab the ID associated with the article from the submit button.
  	var thisId = $(this).attr("data-id");

  	// Run a POST request to change the comment using what's entered in the
  	// inputs.
  	$.ajax({
    	method: "POST",
    	url: "/articles/" + thisId,
    	data: {

      	// Value taken from title input.
      	title: $("#titleinput").val(),
      	// Value taken from comment text area.
      	body: $("#bodyinput").val()
    	}
  	})

   // With that done:
   .done(function(data) {

   	// Log the response.
      console.log(data);
      // Empty the comments section.
      $("#comments").empty();
   });

  // Remove the values entered in the input and text area for comment entry.
  $("#titleinput").val("");
  $("#bodyinput").val("");

});
