
// ***************************** SignUp-Start**********************************
const signUp = document.getElementById("signUp");
signUp.addEventListener("click", (e) => {
  console.log("button clicked");
  e.preventDefault();
  const isValid = signUpValidation();
  console.log(isValid);
  if (!isValid) {
    return;
  }

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.querySelectorAll(".password")[0].value;

  const signUpForm = {
    username: username,
    email: email,
    password: password,
  };

  const apiUrl = "http://localhost:5001/api/users/signup";
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpForm),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Response is ok!!!");
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);

      if(data.message === "User alreday exists. Change the email."){
        
        document.getElementById("emailError").textContent = "User alreday exists. Change the email.";
      }
      else if (data.redirect) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "OTP is send to mail",
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Sign up form validation
let isValid = true;
function signUpValidation() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const passwordElements = document.querySelectorAll(".password");
  const password = passwordElements[0].value.trim();
  const confirmPassword = passwordElements[1].value.trim();
  const checkbox = document.getElementById("checkbox");

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  const passwordPattern = /.{5,}/;

 

  // Clear Previous Error message
  document.getElementById("usernameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document
    .querySelectorAll(".passwordError")
    .forEach((span) => (span.textContent = ""));
  document.getElementById("checkboxError").textContent = "";

  // Validate username
  if (username === "") {
    document.getElementById("usernameError").textContent = "*Username required";
    isValid = false;
  } else if (!usernamePattern.test(username)) {
    document.getElementById("usernameError").textContent =
      "*Invalid username format";
    isValid = false;
  }

  // Validate email
  if (email === "") {
    document.getElementById("emailError").textContent = "*Email required";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "*Invalid Email";
    isValid = false;
  }

  // Validate password
  if (password === "") {
    document.querySelectorAll(".passwordError")[0].textContent =
      "*Password required";
    isValid = false;
  } else if (!passwordPattern.test(password)) {
    document.querySelectorAll(".passwordError")[0].textContent =
      "*At least 5 characters";
    isValid = false;
  }

  // Validate confirm password
  if (confirmPassword === "") {
    document.querySelectorAll(".passwordError")[1].textContent =
      "*Please confirm your password";
    isValid = false;
  } else if (password !== confirmPassword) {
    document.querySelectorAll(".passwordError")[1].textContent =
      "*Passwords do not match";
    isValid = false;
  }

  // Validate checkbox
  if (!checkbox.checked) {
    document.getElementById("checkboxError").textContent =
      "*You must agree to the terms";
    isValid = false;
  }

  // Clear error message for Password field
  document.querySelectorAll("#signUpForm input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const parentDiv = event.target.closest(".inputField");
      const errorSpan = parentDiv.querySelector(".error");

      // Clear the error message for the current input field
      if (errorSpan) {
        errorSpan.textContent = "";
      }
    });
  });

  // Clear the error message while entering
  document.getElementById("signUpForm").addEventListener("input", (event) => {
    const dataName = event.target.id;
    const errorId = `${dataName}Error`;
    document.getElementById(errorId).textContent = "";
  });

  return isValid
}
// ****************************SignUp-End************************************
