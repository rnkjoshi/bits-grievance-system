// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDvHLfq20RFRnYLvWJMKjXVdqnVWDraJyI",
  authDomain: "ccrs-cd063.firebaseapp.com",
  databaseURL: "https://ccrs-cd063.firebaseio.com",
  projectId: "ccrs-cd063",
  storageBucket: "ccrs-cd063.appspot.com",
  messagingSenderId: "312343745184",
  appId: "1:312343745184:web:6e8b67a5e7718ee4c36fc5",
  measurementId: "G-NXCPS90VZK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//refernce users collection
var userRef = firebase.firestore();
var submitButton = document.getElementById("submitButton");

//submit form
function submitForm() {
  console.log("submit clicked");
  //get values
  var fname = getVal("fname");
 var address1 = getVal("address1");
 var address2 = getVal("address2");
 var city = getVal("city");
 var state = getVal("state");
  var mobile = getVal("mobile");
  var Email = getVal("email");
  var password = getVal("password");
  console.log("got all values");
  //check existing user
  userRef
    .doc("Users/" + Email)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        $("#errorUserMsg").show();
        return false;
      } else {
        $("#errorUserMsg").hide();

        //save users
        saveUsers(
          fname,
          address1,
          address2,
          city,
          state,
          mobile,
          Email,
          password
        );
        setTimeout(function() {
          window.alert("Successfully registered");
          window.location = "index.html";
        }, 3000);
      }
    });
}

//function to get form values

function getVal(id) {
  return document.getElementById(id).value;
}

//save users to firebase
function saveUsers(
  fname,
  address1,
  address2,
  city,
  state,
  mobile,
  Email,
  password
) {
  console.log("Creating user...");
  firebase.auth().createUserWithEmailAndPassword(Email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });

  console.log("saving to firebase...");
  const newUserRef = userRef.doc("Users/" + Email);
  var timeStamp = firebase.firestore.FieldValue.serverTimestamp();
  newUserRef
    .set({
      "Account Type":"User",
      "Name": fname,
      // "Last Name": lname,
      // "Enrollment No": en_no,
      // Branch: branch,
      // Semester: semester,
      "Phone Number": mobile,
      "Email Id": Email,
      "Address Line 1":address1,
      "Address Line 2":address2,
      "City":city,
      "State":state,
      "Registered On":timeStamp,
      Password: password
    })
    .catch(function(error) {
      window.alert("Something went wrong. Please try again");
    });
    console.log("saved to firebase");
}
