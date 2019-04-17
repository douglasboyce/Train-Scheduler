  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBQjfN1Hex-KNAQbR3z8oTXHq1jhw6zhdc",
    authDomain: "train-schedule-ba39c.firebaseapp.com",
    databaseURL: "https://train-schedule-ba39c.firebaseio.com",
    projectId: "train-schedule-ba39c",
    storageBucket: "train-schedule-ba39c.appspot.com",
    messagingSenderId: "508545303086"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
var database = firebase.database();

// 2. Button for adding Train
$("#submit").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination-name").val().trim();
    var firstTrain = $("#first-train-time").val().trim();
    var frequency = $("#frequency-time").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destination,
      start: firstTrain,
      frequency: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination-name").val("");
    $("#first-train-time").val("");
    $("#frequency-time").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
  
    // Store everything into a variable.
    var sv = childSnapshot.val();
    var trainName = sv.name;
    var destination = sv.destination;
    var firstTrain = sv.start;
    var frequency = parseInt(sv.frequency);

    firstTrain = moment(firstTrain, "HH:mm").subtract(1, "years");
    // Calculate the minutes until the next train using hardcore math
    var trainRemainder = moment().diff(moment(firstTrain), "minutes") % frequency;
    var trainMinutes = frequency - trainRemainder;
    // Calculate the arrival time
    var trainArrival = moment().add(trainMinutes, "minutes").format("hh:mm A");
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(trainArrival),
      $("<td>").text(trainMinutes)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case