// Login -js
const logIn = document.getElementById("logIn");

logIn.addEventListener("click", async () => {
  console.log("Login btn clicked");
  let isvalid = logInFormValidation();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const statusElement = document.getElementById("status");
 console.log(isvalid);
  if (!isvalid) {
    return;
  }
  const apiUrl = "http://localhost:5001/api/users/login";
  

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
     
        return response.json();
      
      // if (!response.ok) {
      //   throw new Error("Network response was not ok.");
      // }
      // return response.json();
    })

    .then((data) => {
      console.log("API respone:", data);
      if (data.emailNotFound) {
        statusElement.textContent = data.emailNotFound;
      } else if (data.wrongPassword) {
        statusElement.textContent = data.wrongPassword;
      } else if (data.message && data.redirect) {
        window.location.href = data.redirect;
      } else {
        statusElement.textContent = "Login failed! Please try again.";
      }
        // if(data.redirect){
        //     window.location.href = data.redirect
        // } else if(data.emailNotFound ){
        //   document.getElementById("status").textContent = data.emailNotFound;
        // }
        //  else if(data.wrongPassword){
        //    document.getElementById("status").textContent = data.wrongPassword;
        // } else if(data.wrongPassword){
        //   document.getElementById("status").textContent = data.wrongPassword
        // }
    })
    .catch((error) => {
      console.log("Error:", error);
      document.getElementById("status").textContent =
        "Error occuerd please try again.";
    });
});
let isValid = true;
function logInFormValidation() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "*invalid email";
    isValid = false;
  }
 
  if (password === "") {
    document.getElementById("passwordError").textContent = "*password required";
    isValid = false;
  }

  document.getElementById("logInForm").addEventListener("input", (event) => {
    DataName = event.target.id;
    let errorId = `${DataName}Error`;
    document.getElementById(errorId).textContent = "";
  });
  return isValid
}
