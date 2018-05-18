//Initialize Firebase
var config = {
    apiKey: "AIzaSyAeVAZcHT7VMR09wcM_sdcSAEMpyZWJn5s",
    authDomain: "tripscheduler-1d8ed.firebaseapp.com",
    databaseURL: "https://tripscheduler-1d8ed.firebaseio.com",
    projectId: "tripscheduler-1d8ed",
    storageBucket: "tripscheduler-1d8ed.appspot.com",
    messagingSenderId: "480313014351"
  };
  firebase.initializeApp(config);

//variable to reference the database
var database = firebase.database();

//initial values (???????NEEDED?????????)
var keyArray = [];


  $("#addTrainBtn").on("click", function(event) {
    event.preventDefault();
   
   //variables to hold value of text boxes
    a = $("#addTrainName").val().trim();
    b = $("#addDestination").val().trim();
    c = $("#firstTrainTime").val().trim();
    d = $("#addFrequency").val().trim();

    console.log(a);
    console.log(b);
    console.log(d);
    
    var firstArr = moment(c, "HH:mm");
    var freq = d;

    // Current Time
    var currentTime = moment();

    var diffTime = currentTime.diff(moment(firstArr), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % freq;

    // Minutes Until next Train
    var minRemaining = freq - tRemainder;

    // Next Train
    var nextTrain = moment().add(minRemaining, "minutes");

    // Save new value to Firebase
    var result = database.ref().push({
      name: a,
      destination: b,
      firstTrain: c,
      frequency: d,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    console.log(result.key);
    keyArray.push(result.key);
  
    $("#addTrainName").val("");
    $("#addDestination").val("");
    $("#firstTrainTime").val("");
    $("#addFrequency").val("");
  });
  
  
  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function(childSnapshot) {
    var firstArr = moment(childSnapshot.val().firstTrain, "HH:mm");
    var freq = childSnapshot.val().frequency;

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    var diffTime = currentTime.diff(moment(firstArr), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var minRemaining = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minRemaining);

    // Next Train
    var nextTrain = moment().add(minRemaining, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("h:mm a"));
    
    // full list of items to the well
    $("#tableBody").append("<tr> <th scope='row' id='trainNames'>" + childSnapshot.val().name + "</th> <td id='destinations'>" + childSnapshot.val().destination + "</td> <td id='frequencies'>"+ childSnapshot.val().frequency + "</td> <td id='nextArrivals'>" + moment(nextTrain).format('h:mm a') +"</td> <td id='minutesAway'>" + minRemaining +"</td></tr>"
        );
         
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  