// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");

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
    res.json(friendsData);
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

      console.log("differenceCounter = " + differenceCounter);
      console.log("smallestDifference = " + smallestDifference);
      if (differenceCounter <= smallestDifference) {
        smallestDifference = differenceCounter;
        bestMatch = i;
      }
      differenceCounter = 0;

    }

    console.log("Best match is at index " + bestMatch + " of 'friends' array");

    friends.push(newFriend);
    console.log(friends);
    res.json(newFriend);

  });

  app.post("/api/clear", function() {
    // Empty out the arrays of data
    friends = [];
    console.log(friends);
  });
};
