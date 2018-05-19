//initialize Firebase
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

//initial values for global variables
var keyArray = [];
var minRemaining = 0;
var nextTrain = 0;
  //click function for submit button
  $("#addTrainBtn").on("click", function(event) {
    //prevent page from reloading on click
    event.preventDefault();
   
   //variables to hold value of text boxes
    a = $("#addTrainName").val().trim();
    b = $("#addDestination").val().trim();
    c = $("#firstTrainTime").val().trim();
    d = $("#addFrequency").val().trim();
    //prevent submiting empty form or 0 frequency
    if (a == "" || b == "" || c == "" || d== "" || d == 0){
        return;
    }
    //prevent repeat names 
    for (i=0; i<keyArray.length; i++) {
        if (a.toLowerCase() == keyArray[i].toLowerCase()){
            alert ("That name already exists, please choose a new name.");
            return;
        }
    }
    
    // Save new value to Firebase
    var result = database.ref().push({
      name: a,
      destination: b,
      firstTrain: c,
      frequency: d,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    /*
    keyArray.push(result.key);*/
   
    //reset submission fields
    $("#addTrainName").val("");
    $("#addDestination").val("");
    $("#firstTrainTime").val("");
    $("#addFrequency").val("");
  });
  
  
  //firebase watcher & initial loader
  database.ref().on("child_added", function(childSnapshot) {
    //push the names of all trains to keyArray, this array will help prevent repeat name entry
    keyArray.push(Object.values(childSnapshot.val())[4]);
    //variables to hold the first arrival time and the frequency for calculations
    var firstArr = moment(childSnapshot.val().firstTrain, "HH:mm");
    var freq = childSnapshot.val().frequency;
 
    //variable to hold current Time
    var currentTime = moment();
    //variable to hold difference between current time and first train arrival
    var diffTime = currentTime.diff(moment(firstArr), "minutes");

    //variable to hold remainder of difftime and the frequency of arrival
    var tRemainder = diffTime % freq;

    //minutes until next train
    minRemaining = freq - tRemainder;

    //time of next Train
    nextTrain = moment().add(minRemaining, "minutes");
    
    //add table html with firebase data to the table body
    $("#tableBody").append("<tr> <th scope='row' id='trainNames'>" + childSnapshot.val().name + "</th> <td id='destinations'>" + childSnapshot.val().destination + "</td> <td id='frequencies'> every "+ childSnapshot.val().frequency + " minutes</td> <td id='nextArrivals'>" + moment(nextTrain).format('h:mm a') +"</td> <td id='minutesAway'>" + minRemaining +"</td></tr>"
        );
         
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  