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
var userRef = firebase.firestore().collection("Forms");
var temp;
window.onload = function() {
  temp = localStorage.getItem("userId");
  if (temp == null) {
    window.alert("Not allowed.\nPlease Login first.");
    window.location.href = "index.html";
  }
};

//get data and update table
userRef
  .get()
  .then(function(querySnapshot) {
    var content = "";
    querySnapshot.forEach(function(doc) {
      var id = doc.id;
      var en_no = doc.get("02 Enrollment No");
      var fname = doc.get("03 First Name");
      var lname = doc.get("04 Last Name");
      var category = doc.get("07 Category");
      var subject = doc.get("08 Subject");
      var description = doc.get("09 Description");
      if (doc.get("10 Status") == "Open") {
        content +=
          '<tr> <th scope="row"> <div class="custom-control custom-checkbox"> <input type="checkbox" class="custom-control-input" id="Check"> </div>  </th>';
        content += "<td>" + id + "</td>";
        content += "<td>" + en_no + "</td>";
        content += "<td>" + fname + lname + "</td>";
        content += "<td>" + category + "</td>";
        content += "<td>" + subject + "</td>";
        content += "<td>" + description + "</td>";
      }
    });
    $("#dataTable").append(content);
  })
  .catch(function(error) {
    window.alert("Error getting documents: ", error);
  });

//function to update database
function getSelected() {
  //Reference the Table.
  var grid = document.getElementById("dataTable");

  //Reference the CheckBoxes in Table.
  var checkBoxes = grid.getElementsByTagName("input");

  var f = false;

  //Loop through the CheckBoxes.
  for (i = 0; i < checkBoxes.length; i++) {
    var objCells = grid.rows.item(i + 1).cells;
    if (checkBoxes[i].checked) {
      var id = objCells.item(1).innerHTML;
      newUserRef = userRef.doc(id);
      f = true;
      var temp = newUserRef
        .update({
          "10 Status": "Close"
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          f = false;
          window.alert("Error updating record: ", error);
        });
    }
  }
  if (f != false) {
    window.alert("Record successfully updated!");
    window.location.reload();
  }
}
