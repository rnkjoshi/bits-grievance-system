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

//reference users collection
var userRef = firebase.firestore().collection("Users");
var phoneNumber;

//validating with database
function valAndGenOTP() {
  var Email = document.getElementById("email").value;
  var password = document.getElementById("Password").value;

  userRef
    .doc(Email)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        $("#errorUserMsg").hide();
        userRef
          .where("Email Id", "==", Email)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              var getPassword = doc.get("Password");
              if (getPassword != password) {
                document.getElementById("errorPasswordMsg").style.display =
                  "block";
                return false;
              } else {
                document.getElementById("errorPasswordMsg").style.display =
                  "none";
                phoneNumber = doc.get("Phone Number");
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                  "recaptcha-container"
                );
                // {
                //   size: 'invisible',
                //   callback: function (response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                //var en_no = document.getElementById("en_no").value;
                // userRef
                //   .where("Enrollment No", "==", en_no)
                //   .get()
                //   .then(function (querySnapshot) {
                //     querySnapshot.forEach(function (doc) {
                //       var phoneNumber = doc.get("Phone Number");
                var appVerifier = window.recaptchaVerifier;
                firebase
                  .auth()
                  .signInWithPhoneNumber(phoneNumber, appVerifier)
                  .then(function(confirmationResult) {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    window.alert("Message sent successfully to" + phoneNumber);
                  })
                  .catch(function() {
                    window.alert("Something went wrong.\n SMS not sent");
                    window.recaptchaVerifier.render().then(function(widgetId) {
                      grecaptcha.reset(widgetId);
                    });
                  });
              }
            });
          })
          .catch(function() {
            window.alert("Something went wrong. Please try again");
          });
      } else {
        $("#errorUserMsg").show();
        return false;
      }
    })
    .catch(function() {
      window.alert("Something went wrong. Please try again");
    });
}

//function for otp verification
function verifyCode() {
  var code = document.getElementById("verCode").value;
  confirmationResult
    .confirm(code)
    .then(function() {
      var getUserId = document.getElementById("email").value;
      localStorage.setItem("userId", getUserId);
      alert("Login process successfull!\n Redirecting");
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     // User is signed in.
      //     window.alert("hii");
      //   } else {
      //     // No user is signed in.
      //   }
      // });
      window.location.href = "grievances.html";
      // User signed in successfully.
    })
    .catch(function() {
      window.alert("User couldn't sign in (bad verification code?)");
      window.recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
}
