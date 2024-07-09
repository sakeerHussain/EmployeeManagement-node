// verifyOTP-js

const verifyOTP = document.getElementById("verifyOTP");
const otpCode = document.getElementById("otpCode");
const otpError = document.getElementById("otpError");

verifyOTP.addEventListener("click" , (e) =>{
    console.log("clicked");
    e.preventDefault();
    const isValid = otpValidation();
    if(!isValid){
        return;
    }

    const apiUrl = "http://localhost:5001/api/users/verifyOTP";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({otp: otpCode.value.trim() })
    })
    .then((response) => {
      if(!response.ok){
        throw new Error('Network response was not ok')
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
       if (data.redirect) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Signup Successful",
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 2000);
      } else {
          otpError.textContent = data.otpMismatch || "Verification failed, please try again.";
      }
      
    })
    .catch((error) => {
      console.error("Error:" , error);
      otpError.textContent = "An error occured.Please try again."
    });
});






 
otpCode.addEventListener("input", () =>{
    otpError.textContent = "";
});

function otpValidation() {
    const otpCodeValue = otpCode.value.trim();
     let isValid = true;

    if(otpCodeValue === ""){
        otpError.textContent = "*OTP required";
        isValid = false;
    } else if(!/^\d{6}$/.test(otpCodeValue)){
        otpError.textContent = "*OTP requires six digit"
        isValid = false; 
    } 
    else{
        otpError.textContent = "";
    }

    return isValid;

}

