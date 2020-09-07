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

//get en_no from login
var en_no1;
window.onload = function() {
  en_no1 = localStorage.getItem("userId");
  if (en_no1 == null) {
    window.alert("Not allowed.\nPlease Login first.");
    window.location.href = "index.html";
  }
};

//reference users collection
var userRef = firebase.firestore().collection("Users");
var grievanceRef = firebase.firestore();

//check for user existence
/*function chkUser() {
  //var en_no = document.getElementById("en_no").value;
  en_no1 = localStorage.getItem("userId");
  userRef
    .doc(en_no1)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        $("#errorEn_noMsg").hide();
        submitGrievance(en_no1);
      } else {
        $("#errorEn_noMsg").show();
        return false;
      }
    })
    .catch(function() {
      window.alert("Something went wrong. Please try again");
    });
}*/
//submit form
function submitGrievance() {
  //get values
  var category = getVal("category");
  var subject = getVal("subject");
  var description = getVal("description");
  en_no1 = localStorage.getItem("userId");

  //get other info of users
  userRef
    .where("Enrollment No", "==", en_no1)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var fname = doc.get("First Name");
        var lname = doc.get("Last Name");
        var en_no = doc.get("Enrollment No");
        var branch = doc.get("Branch");
        var semester = doc.get("Semester");
        //save users
        saveGrievance(
          en_no,
          fname,
          lname,
          branch,
          semester,
          category,
          subject,
          description
        );
      });
    });

  setTimeout(function() {
    window.alert("Grievance submitted successfully.\n Signing out");
    window.localStorage.removeItem("userId");
    window.location.href = "index.html";
  }, 3000);
}

//function to get form values
function getVal(id) {
  return document.getElementById(id).value;
}

//save users to firebase
function saveGrievance(
  en_no,
  fname,
  lname,
  branch,
  semester,
  category,
  subject,
  description
) {
  const newGrievanceRef = grievanceRef.collection("Forms");
  var timeStamp = firebase.firestore.FieldValue.serverTimestamp();
  newGrievanceRef
    .add({
      "01 Submitted On": timeStamp,
      "02 Enrollment No": en_no,
      "03 First Name": fname,
      "04 Last Name": lname,
      "05 Branch": branch,
      "06 Semester": semester,
      "07 Category": category,
      "08 Subject": subject,
      "09 Description": description,
      "10 Status": "Open"
    })
    .catch(function() {
      window.alert("Something went wrong. Please try again");
    });
}
