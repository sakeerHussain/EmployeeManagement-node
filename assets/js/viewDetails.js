

// Close Icon Action
function closeAction() {
   
  let editEmployeeForm = document.getElementById('editEmployeeForm');
  let overlay = document.getElementById('overlay');

  editEmployeeForm.style.display = "none";
  overlay.style.display = "none";
} 



// Displaying Employee details....
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log(id);

viewDetails(id);

function viewDetails(id){

fetch(`http://localhost:5001/api/employees/${id}`)
.then (response =>{
 if(!response.ok){
  throw new Error(`Cannot get Employee details with: ${id}`);
 } return response.json();
})
.then(data => {
   document.getElementById("EmployeeProfilePic").innerHTML = `<img src ="/${data.image}">`
             
  const fullName = data.salutation + " " + data.firstName + " " + data.lastName;
  document.getElementById('EmployeeName').innerHTML = fullName;
  document.getElementById('EmployeeMail').innerHTML = data.email;
  document.getElementById('Gender').innerHTML = data.gender;
  document.getElementById('Age').innerHTML = data.date;
  const DOB = changeformatYMD(data.date);
  const [date, month, year] = data.date;
  const age = calculateAge(DOB);
  document.getElementById('Dob').innerHTML = age;
  document.getElementById('PhoneNumberDetails').innerHTML = data.mobileNumber;
  document.getElementById('QualificationsDetails').innerHTML = data.qualification;
  document.getElementById('AddressDetails').innerHTML = data.address;
  document.getElementById('UsernameDetails').innerHTML =  data.firstName;

});
}

function calculateAge(age) {
  const dob = new Date(age);
  const currentDate = new Date();
  const timeDiff = currentDate - dob;
  const Age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
  return Age;
}
function changeformatYMD(DOB) {
  const [date, month, year] = DOB.split("-");
  let formatteddate = year + "-" + month + "-" + date;
  return formatteddate;
}


// Delete action in view details
function deleteView(id) {
return  fetch(`http://localhost:5001/api/employees/${id}`, {
      method: 'DELETE',
  }
  ).then((response) =>{
      if(!response.ok){
          throw new Error(`Cannot delete employee with id:${id}`);
      }
  })
      .then(data => {
          console.log('API Response:', data);
      })
      .catch(error => {
          console.error('Error:', error);
      });

}

// Delete Action in View Employee Form**********

const deleteViewEvents = document.getElementById("deleteViewEmployee");
deleteViewEvents.addEventListener("click", () => {
console.log(id);
Swal.fire({
  title: "Are you sure?",
  text: "Do you really want to delete this employee? This action cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Yes, delete it!",
})

.then((result) => {
  if (result.isConfirmed) {
    showLoading();
    deleteView(id)
    .then(() => {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Employee has been deleted",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
    });
  }
})
.catch((error) => {
  console.error("Error in deleteing employee.");
})
});

function showLoading() {
  document.getElementById("deleteViewEmployee").disabled = true;
}

// Delete confirmation popup
function deleteConfirmPopup(){
let deleteEmployeePopup =  document.getElementById("deleteEmployePopup")
deleteEmployeePopup.style.display = "block";
let overlay = document.getElementById("overlay")
overlay.style.display = "block";
console.log("sakeer");
}








// Delete Employee Popup

// let deleteViewEmployee = document.getElementById('deleteViewEmployee');       
// deleteViewEmployee.addEventListener("click", () => {
//     deletePopup(id)
// });


// let viewEmployeeCloseAction = document.getElementById('closeBtn');
// viewEmployeeCloseAction.addEventListener("click", deletePopupClose);
// let cancelDeleteEmployeeId = document.getElementById('cancelDeleteEmployeeId');
// cancelDeleteEmployeeId.addEventListener("click", deletePopupClose);

// function deletePopup(){
//     let deleteEmployePopup = document.getElementById('deleteEmployePopup');
//     deleteEmployePopup.style.display = "block";
//     let overlay = document.getElementById('overlay');
//     overlay.style.display = "block";
// }
// // Delete Employee Popup close
// function deletePopupClose(){
//     let deleteEmployePopup = document.getElementById('deleteEmployePopup');
//     deleteEmployePopup.style.display = "none";
//     let overlay = document.getElementById('overlay');
//     overlay.style.display = "none";
// }
// // Delete Employee

// const closeBtn = document.getElementById('deleteEmployeeId');
// closeBtn.addEventListener("click" , () =>{
//     deleteView(id);
//     deletePopupClose()
//     window.location.href = "EmployeeManagement_pg-1.html";

// } );

// END*********


// Edit Action in ViewEmployee Form*******

// Edit Form display
let editViewEmployee = document.getElementById('editViewEmployee');
editViewEmployee.addEventListener("click" , () => {
  displayEditForm ()

});

function displayEditForm (){
  let editEmployeeForm = document.getElementById('editEmployeeForm');
  editEmployeeForm.style.display = "block";

  let overlay = document.getElementById('overlay');
  overlay.style.display = "block";


  // ID passing

  fetch(`http://localhost:5001/api/employees/${id}`)
      .then((res) => {
          if(!res.ok){
              throw new Error("Network response was not ok.")
          }
          return res.json();
      })
      .then((data) => {
         

          const edit_img = document.getElementById("edit_EmployeeImage");
          edit_img.src = `http://localhost:5001/api/employeed/${id}`;
          document.getElementById("edit_EmployeeImage").src = data.image;
          document.getElementById("editSalutation").value = data.salutation;
          document.getElementById("editFirstName").value = data.firstName;
          document.getElementById("editLastName").value = data.lastName;
          document.getElementById("editEmail").value = data.email;
          document.getElementById("editMobileNumber").value = data.mobileNumber;

          //  Format date of birth
          const dobValue = data.date;
          const [day, month, year] = dobValue.split("-");
          const formattedDob = `${year}-${month}-${day}`;
          document.getElementById("editDateOfBirth").value = formattedDob;
          
          document.querySelector
          (`input[name="genderEdit"][value ="${data.gender}"]`).checked = true;

          document.getElementById("editQualification").value = data.qualification;
          document.getElementById("editAddress").value = data.address;
          document.getElementById("editCountry").value = data.country;
          document.getElementById("editState").value = data.state;
          document.getElementById("editCity").value = data.city;
          document.getElementById("editPin").value = data.pin;
      })

      .catch(error => {
          console.error('error:', error)
      })

      const editBtn = document.getElementById("saveEditEmployee");
      editBtn.addEventListener('click', async(e) =>{
          e.preventDefault();
          editViewEmployeeForm(id);
      })
}   

function editViewEmployeeForm(id) {

  const editSalutation = document.getElementById("editSalutation").value;
  const editFirstName = document.getElementById("editFirstName").value;
  console.log(editFirstName);
  const editLastName = document.getElementById("editLastName").value;
  const editEmail = document.getElementById("editEmail").value;
  const editMobileNumber = document.getElementById("editMobileNumber").value;
  const editDateOfBirth = document.getElementById("editDateOfBirth").value;
  const editGender = document.querySelector('input[name = "genderEdit"]:checked').value;
  const editQualification = document.getElementById("editQualification").value;
  const editAddress = document.getElementById("editAddress").value;
  const editCountry = document.getElementById("editCountry").value;
  const editState = document.getElementById("editState").value;
  const editCity = document.getElementById("editCity").value;
  const editPin = document.getElementById("editPin").value;

  const [year, month, day] = editDateOfBirth.split("-");
  const editFormattedDate = `${day}-${month}-${year}`

  const formData= new FormData()
  const edit_upload_file = document.getElementById("edit_upload_file").files[0];
  if (edit_upload_file) {
    formData.append("image", edit_upload_file);
  }
  formData.append("salutation", editSalutation);
  formData.append("firstName", editFirstName);
  formData.append("lastName", editLastName);
  formData.append("email", editEmail);
  formData.append("mobileNumber", editMobileNumber);
  formData.append("dateOfBirth", editFormattedDate);
  formData.append("gender", editGender);
  formData.append("qualification", editQualification);
  formData.append("address", editAddress);
  formData.append("country", editCountry);
  formData.append("state", editState);
  formData.append("city", editCity);
  formData.append("pin", editPin);
  formData.append("username", editFirstName);
  formData.append("password", editMobileNumber);

  fetch(`http://localhost:5001/api/employees/${id}`, {
      method: "PUT",
      body: formData,
  })
      .then(response => {
          if(!response.ok){
              throw new Error("Network response was not ok")
          }
          return response.json();
      })
      .then((data) => {
          console.log("API Response:",data);

           // Show success popup using SweetAlert
      Swal.fire({
          title: 'Success!',
          text: 'Employee details updated successfully.',
          icon: 'success',
          confirmButtonText: false,
          timer: 2000})
      }).then( () =>{
              setTimeout(()=>{
                  window.location.href = "/home"; 
              },2000);
      }).catch(error => {
          console.error('Error:', error);
      }) 

}

// Edit Employee Upload Image

let selectedImage = document.getElementById("edit_EmployeeImage");
let edit_upload_file = document.getElementById("edit_upload_file");
edit_upload_file.onchange = function(){
  selectedImage.src = URL.createObjectURL(edit_upload_file.files[0]);
 
}




// Edit

