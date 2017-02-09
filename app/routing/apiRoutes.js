// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");

// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");

// DATA
  // =============================================================
  var friends = [];

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    res.json(friends);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate Javascript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the friendsData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) { 
    // Create New Friend - takes in JSON input
    var newFriend = req.body;
    newFriend.routeName = newFriend.name.replace(/\s+/g, "").toLowerCase();

    //Calculates difference between newFriend and each saved friend
    var differenceCounter = 0;
    var smallestDifference = 9000;
    var bestMatch = 0;
    for (var i = 0; i<friends.length; i++) {

      for (var j = 0; j<friends[i].scores.length; j++) {
        if (newFriend.scores[j] < friends[i].scores[j]) {
          differenceCounter += (friends[i].scores[j] - newFriend.scores[j])
        }
        else if (newFriend.scores[j] > friends[i].scores[j]) {
          differenceCounter += (newFriend.scores[j] - friends[i].scores[j])
        }
      }
      
      if (differenceCounter <= smallestDifference) {
        smallestDifference = differenceCounter;
        bestMatch = i;
      }
      differenceCounter = 0;

    }

    friends.push(newFriend);

    if (friends.length > 1) {
      var returnedFriend = {
        name: friends[bestMatch].name,
        photo: friends[bestMatch].photo,
        scores: friends[bestMatch].scores
      }
    }
    else {
      var returnedFriend = {
        name: "First Entry",
        photo: newFriend.photo,
        scores: newFriend.scores
      }
      console.log("First entry!")
    }

    res.json(returnedFriend);
  });

  app.get("/api/clear", function(req, res) {
    // Empty out the arrays of data
    friends = [];
    console.log(friends);
    res.sendFile(path.join(__dirname, "/../public/home.html"));
  });
};
