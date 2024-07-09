// Close Icon Action
function closeAddForm() {
    let addEmployeeForm = document.getElementById("AddForm");
    let overlay = document.getElementById("overlay");
  
    addEmployeeForm.style.display = "none";
    overlay.style.display = "none";
    clearForm();
    getEmployee();
  }
  function closeEditForm() {
    let editEmployeeForm = document.getElementById("editEmployeeForm");
    let overlay = document.getElementById("overlay");
  
    editEmployeeForm.style.display = "none";
    overlay.style.display = "none";
    clearErrorMessage();
    getEmployee();
  }
  
  // Clear the error message -----
  function clearErrorMessage() {
    const errorElements = document.querySelectorAll(".error");
    errorElements.forEach(function (element) {
      element.textContent = "";
    });
  }
  
  // *****Display Employee data*******
  function displayEmployeeData(data, TotalCountOnPage) {
    let tableData = "";
  
    for (let i = 0; i < data.length; i++) {
      const employee = data[i];
  
      tableData += `<tr>
                  
                  <td>#0${(CurrentPage - 1) * TotalCountOnPage + i + 1}</td>
                  <td class="userDetailsBoxImg">
                      <div class="userBoxImg">
                          <img src="/${employee.image}">
                      </div>
                      ${
                        employee.salutation +
                        "." +
                        employee.firstName +
                        " " +
                        employee.lastName
                      }
                  </td>  
                  <td>${employee.email}</td>
                  <td>${employee.mobileNumber}</td>
                  <td>${employee.date}</td>
                  <td>${employee.gender}</td>
                  <td>${employee.country}</td>
                  <td>
                    <div class="menu_icon">
                      <button class="three_dot_list" onclick="three_dot_list('${employee._id}')">
                          <i class="fa-solid fa-ellipsis"></i>
                      </button>
                    </div>
                  </td>
                      
                    <div clss="employee_action_btn" id = "employee_action_btn"></div>
                  
              </tr>`;
    }
  
  /* <td class="active">
                      <button type="button" class="tableDropdown" onclick="three_dot_list('${
                        employee._id
                      }')"><i class="fa-solid fa-ellipsis"></i></button>        
                  </td>
                  <div clss="employee_action_btn" id = "employee_action_btn"></div> */
  
  
    document.getElementById("tableBody").innerHTML = tableData;
  }
  
  getEmployee();
  var isFetching = false;
  var CurrentPage = 1;
  
  //*******Fetch Operation / get employee starts *******
  function getEmployee() {
    if (isFetching) {
      return;
    }
    isFetching = true;
    const employeeCountChange = document.getElementById("employeeNumber");
    const TotalCountOnPage = employeeCountChange.value;
  
    fetch(
      `http://localhost:5001/api/employees?page=${CurrentPage}&size=${TotalCountOnPage}`
    )
      .then((Response) => {
        return Response.json();
      })
      .then((data) => { 
        isFetching = false;
  
        // --list-employee-length----start
        employeeCountChange.addEventListener("change", getEmployee);
        const total_employee = document.getElementById("employeeTotal");
        total_employee.innerHTML = `of ${data.Totalemployees.length}`;
  
        // --list-employee-length----end
  
        const totalPages = Math.ceil(
          data.Totalemployees.length / TotalCountOnPage
        );
        pagination(totalPages);
        displayEmployeeData(data.employees, TotalCountOnPage);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        isFetching = false;
      });
  }
  
   //******pagination*******
  function pagination(totalPages) {
    var pgnum = document.getElementById("Page_Num_Btns");
    let temp = "";
  
    for (let i = 1; i <= totalPages; i++) {
      temp += `<button id="page${i}">${i}</button>`;
    }
    pgnum.innerHTML = temp;
    pgnum.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") {
        const pageNumber = parseInt(e.target.textContent);
        if (!isNaN(pageNumber)) {
          CurrentPage = pageNumber;
          getEmployee();
        }
      }
    });
  
    var pageLeftButton = document.getElementById("pageleft");
    var pageRightButton = document.getElementById("pageright");
  
    if (CurrentPage === 1) {
      pageLeftButton.classList.add("hidden");
    } else {
      pageLeftButton.classList.remove("hidden");
    }
  
    if (CurrentPage === totalPages) {
      pageRightButton.classList.add("hidden");
    } else {
      pageRightButton.classList.remove("hidden");
    }
  
    pageLeftButton.addEventListener("click", function () {
      if (CurrentPage > 1) {
        CurrentPage--;
        getEmployee();
      }
    });
  
    pageRightButton.addEventListener("click", function () {
      if (CurrentPage < totalPages) {
        CurrentPage++;
        getEmployee();
      }
    });
  
    const actionButton = document.getElementById(`page${CurrentPage}`);
    actionButton.classList.add("active");
  }
  // Pagnation-end
  
  // Add-Employee---------start
  
  const addEmployee = document.getElementById("addEmployee");
  addEmployee.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const salutation = document.getElementById("salutation").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const mobileNumber = document.getElementById("mobileNumber").value;
    const dateOfBirth = document.getElementById("date").value;
    const [year, month, day] = dateOfBirth.split("-");
    const dob = `${day}-${month}-${year}`;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const qualification = document.getElementById("qualification").value;
    const address = document.getElementById("address").value;
    const country = document.getElementById("country").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;
    const pin = document.getElementById("pin").value;
    const image = document.getElementById("image").files[0];
  
    const formData = new FormData();
  
    formData.append("image", image);
    formData.append("salutation", salutation);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("date", dob);
    formData.append("gender", gender);
    formData.append("qualification", qualification);
    formData.append("address", address);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("pin", pin);
    formData.append("username", firstName);
    formData.append("password", mobileNumber);
  
    //  POST.....
    const apiUrl = "http://localhost:5001/api/employees";
    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          getEmployee();
          closeAddForm();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Employee added successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    getEmployee();
    CurrentPage = 1;
  });
  
  // Delete Employee PopUp
  
  function deleteEmployeePopUp(id) {
    // displaying
    let deleteEmployee = document.getElementById("deleteEmployePopup");
    let overlay = document.getElementById("overlay");
    deleteEmployee.style.display = "block";
    overlay.style.display = "block";
  
    const deleteEmployeeId = document.getElementById("deleteEmployeeId");
    deleteEmployeeId.addEventListener("click", () => {
      deleteEmp(id);
    });
  }
  
  // ******** Delete Employee ********
  function deleteEmp(id) {
    fetch(`http://localhost:5001/api/employees/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
  
      .then((data) => {
        console.log("API Response:", data);
        Swal.fire({
          title: "Deleted!",
          text: "Employee has been deleted successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        getEmployee();
      })
  
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  // Employee  Deleted Successfully
  
  function employeeDeletedSuccesfull() {
    let employeeDeleted = document.getElementById("employeeDeletedPopup");
    employeeDeleted.style.display = "block";
    setTimeout(() => {
      employeeDeleted.style.display = "none";
    }, 700);
  }
  
  // Edit Employee Form data insert
  
  function editEmployee(id) {
    let editEmployee = document.getElementById("editEmployeeForm");
    let overlay = document.getElementById("overlay");
    editEmployee.style.display = "block";
    overlay.style.display = "block";
    console.log("Edit employee with ID:", id);
  
    // Fetching Employee details based on ID
    fetch(`http://localhost:5001/api/employees/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Employee Data:", data);
  
        // Populate form fields with fetched data
        const edit_img = document.getElementById("edit_EmployeeImage");
        edit_img.src = `http://localhost:5001/api/employees/${id}`;
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
        document.getElementById("editdob").value = formattedDob;
  
        // check radio button for gender
        document.querySelector(
          `input[name="genderEdit"][value ="${data.gender}"]`
        ).checked = true;
  
        document.getElementById("editQualification").value = data.qualification;
        document.getElementById("editAddress").value = data.address;
        document.getElementById("editCountry").value = data.country;
        document.getElementById("editState").value = data.state;
        document.getElementById("editCity").value = data.city;
        document.getElementById("editPin").value = data.pin;
        getEmployee();
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
      });
    // Saving Changes
    const editBtn = document.getElementById("saveEditEmployee");
    editBtn.addEventListener("click", async (e) => {
      e.preventDefault();
  
      const isValid = validateEditForm();
      if (!isValid) {
        return;
      }
      editEmployeeFormSubmit(id);
      closeEditForm();
      getEmployee();
    });
  }
  
  // EDIT......
  function editEmployeeFormSubmit(id) {
    // Gather form data
    const editSalutation = document.getElementById("editSalutation").value;
    const editFirstName = document.getElementById("editFirstName").value;
    const editLastName = document.getElementById("editLastName").value;
    const editEmail = document.getElementById("editEmail").value;
    const editMobileNumber = document.getElementById("editMobileNumber").value;
    const editDateOfBirth = document.getElementById("editdob").value;
    const editGender = document.querySelector(
      'input[name="genderEdit"]:checked'
    ).value;
    const editQualification = document.getElementById("editQualification").value;
    const editAddress = document.getElementById("editAddress").value;
    const editCountry = document.getElementById("editCountry").value;
    const editState = document.getElementById("editState").value;
    const editCity = document.getElementById("editCity").value;
    const editPin = document.getElementById("editPin").value;
    const formData = new FormData();
    const edit_upload_file = document.getElementById("edit_upload_file").files[0];
    if (edit_upload_file) {
      formData.append("image", edit_upload_file);
    }
    formData.append("salutation", editSalutation);
    formData.append("firstName", editFirstName);
    formData.append("lastName", editLastName);
    formData.append("email", editEmail);
    formData.append("mobileNumber", editMobileNumber);
    formData.append("dateOfBirth", editDateOfBirth);
    formData.append("gender", editGender);
    formData.append("qualification", editQualification);
    formData.append("address", editAddress);
    formData.append("country", editCountry);
    formData.append("state", editState);
    formData.append("city", editCity);
    formData.append("pin", editPin);
    formData.append("username", editFirstName);
    formData.append("password", editMobileNumber);
  
    // console.log(formData);
  
    fetch(`http://localhost:5001/api/employees/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update employee.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee updated successfully:", data);
        getEmployee();
        employeeEditedSuccessfull();
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
      });
  }
  
  // Employee Edited Successfully
  
  function employeeEditedSuccessfull() {
    let employeeEdited = document.getElementById("employeeEditedPopup");
    employeeEdited.style.display = "block";
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  
    setTimeout(() => {
      employeeEdited.style.display = "none";
      overlay.style.display = "none";
    }, 3000);
  }
  
  // Edit Employee Upload Image------start
  
  let selectedImage = document.getElementById("edit_EmployeeImage");
  let edit_upload_file = document.getElementById("edit_upload_file");
  edit_upload_file.onchange = function () {
    selectedImage.src = URL.createObjectURL(edit_upload_file.files[0]);
  };
  
  // ... button dropdown
  function three_dot_list(id) {
    const three_dot_list = document.getElementById("employee_action_btn");
    console.log(id);
    three_dot_list.innerHTML = ` 
     <div class="employee_action_btn">
    <a href="viewDetails?id=${id}" > <button class="employee_btn view_btn"><i class="fa-solid fa-eye" ></i>View Details</button></a>
    <button class="employee_btn edit_btn"><i class="fa-solid fa-pen"></i>Edit</button>
    <button class="employee_btn delete_btn"><i class="fa-regular fa-trash-can"></i>Delete</button>
    </div>`;
  
    three_dot_list.style.display = "block";
  
    //****** three dot arrange *******//
    // const moreOptionToggles = document.querySelectorAll(".three_dot_list");
    // moreOptionToggles.forEach((btn) => {
    //   btn.addEventListener("click", (event) => {
    //     const buttonRect = event.target.getBoundingClientRect();
    //     const btnActive = document.querySelector(".employee_action_btn");
    //     btnActive.style.top = buttonRect.top - 100 + "px";
    //     btnActive.style.display =
    //       btnActive.style.display === "none" || btnActive.style.display === ""
    //         ? "block"
    //         : "none";
    //     event.stopPropagation();
    //   });
    // });
  
    document.addEventListener("DOMContentLoaded", () =>{
      document.addEventListener("click", (event) =>{
        if(event.target.closeset(".three_dot_list")) {
          const toggleButton = event.target.closest(".three_dot_list");
          const buttonRect = toggleButton.getBoundingClientRect();
          const btnActive = toggleButton.parentElement.querySelector(".employee_action_btn");
  
  
          // Position the action menu below the button
        btnActive.style.top = `${buttonRect.bottom + window.scrollY}px`;
        btnActive.style.left = `${buttonRect.left + window.scrollX}px`;
        btnActive.style.display = btnActive.style.display === "none" || btnActive.style.display === "" ? "block" : "none";
        event.stopPropagation();
        }
      })
    })
  
    //*********** Screen_click_to_closing ********//
    function closeMenu() {
      three_dot_list.style.display = "none";
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  
    function handleOutsideClick(event) {
      if (!three_dot_list.contains(event.target)) {
        closeMenu();
       }
       }
    
      document.addEventListener("mousedown", handleOutsideClick);
  
     // ************ DELETE EMPLOYEE ***********
    const deleteEmployeeButton = document.querySelector(".delete_btn");
    deleteEmployeeButton.addEventListener("click", () => {
      deleteEmp(id);
    });
  
     // ************* EDIT EMPLOYEE ***********
    const editEmployeeButton = document.querySelector(".edit_btn");
    editEmployeeButton.addEventListener("click", () => {
      editEmployee(id);
    });
  
  }
  
  // Add Employee Form Popup action
  
  function actionAddEmployee() {
    let addEmployeeForm = document.getElementById("AddForm");
    let overlay = document.getElementById("overlay");
  
    addEmployeeForm.style.display = "block";
    overlay.style.display = "block";
  }
  function actionAddEmployeeClose() {
    let addEmployeeForm = document.getElementById("AddForm");
    let overlay = document.getElementById("overlay");
  
    addEmployeeForm.style.display = "none";
    overlay.style.display = "none";
  }
  
  
  //Add employee form user picture upload
  
  let profilePic = document.getElementById("employeeProfilePic");
  let inputFile = document.getElementById("image");
  inputFile.onchange = function () {
    profilePic.src = URL.createObjectURL(inputFile.files[0]);
    console.log("file path:", inputFile.files[0]);
  };
  
  // Search Employee
  
  function searchInput() {
   let searchKey = document.getElementById("searchInput").value;
   searchKey = searchKey.toLowerCase() ;
   const employeeNotFound = document.getElementById("employeeNotFound");
  
   if(searchKey) {
    fetch(`http://localhost:5001/api/employees/search/${searchKey}`)
    .then((response) => response.json())
    .then((data) => {
      displayEmployeeData(data.employee, data.employee.length);
      if(data.employee.length === 0) {
        employeeNotFound.style.display = "block";
      }
      else {
        employeeNotFound.style.display = "none";
      }
    })
    .catch((error) => console.error("Error:", error));
   } else {
    getEmployee()
    employeeNotFound.style.display = "none";
   }
  }
  // clearform
  function clearForm() {
    var form = document.getElementById("AddEmp");
    form.reset();
    const imgView = document.getElementById("employeeProfilePic");
    imgView.src = "";
  
    // clear all error message and reset border colors
    const errorElements = form.querySelectorAll(".error");
    errorElements.forEach((element) => {
      element.innerHTML = "";
    });
  
    const inputElements = form.querySelectorAll("input, select");
    inputElements.forEach((element) => {
      element.style.borderColor = "unset";
    });
  }
  
  // close icon display none
  
  function closeDeletePopup() {
    let closeDeletePopup = document.getElementById("deleteEmployePopup");
    closeDeletePopup.style.display = "none";
    overlay.style.display = "none";
  }

  // Logout- *START
 document.getElementById("logoutLink").addEventListener("click", (event) =>{
  event.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!'
  }).then((result) => {
    if(result.isConfirmed) {
      window.location.href = "/api/users/logout";
    } 
  });

 })
  // Validation - start*******
  
  /* Add employee form validation - Start  */
  document.getElementById("AddEmp").addEventListener("input",(event) =>{
    const targetElement = event.target;
    const errorId = `${targetElement.id}-Error`;
  
    const errorElement = document.getElementById(errorId);
    if(errorElement){
      errorElement.textContent = "";
      targetElement.style.borderColor = "unset";
    }
  }); 
  
  function validateField(key, isEmail = false, isPhone = false) {
    const fieldElement = document.getElementById(key);
    const errorElement = document.getElementById(`${key}-Error`);
  
  
    if (!fieldElement) {
        console.error(`Element with id '${key}' not found`);
        return false;
    }
  
    const field = fieldElement.value;
  
    if (!field) {
        errorElement.innerHTML = `${capitalizeFirstLetter(key)} is required`;
        fieldElement.style.borderColor = "red";
        return false;
    }
  
    if (isEmail && !validateEmailFormat(field)) {
        errorElement.innerHTML = `Please enter a valid email address`;
        fieldElement.style.borderColor = "red";
        return false; 
    }
  
    if(isPhone && !validatePhoneFormat(field)){
      errorElement.innerHTML = `Pelease enter a valid phone number`;
      fieldElement.style.borderColor = "red";
      return false; 
    }
  
    errorElement.innerHTML = "";
    fieldElement.style.borderColor = "unset";
    return true;
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  
  function validateEmailFormat(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  function validatePhoneFormat(phone){
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  }
  
  function validateGender() {
    const male = document.getElementById("male");
    const female = document.getElementById("female");
    const genderError = document.getElementById("gender-Error");
  
    if (!male.checked && !female.checked) {
        genderError.innerHTML = "Gender is required";
        return false;
    }
  
    genderError.innerHTML = "";
    return true;
  }
  
  function validateForm() {
    let isValid = true;
    
    isValid = validateField("image") && isValid;
    isValid = validateField("salutation") && isValid;
    isValid = validateField("firstName") && isValid;
    isValid = validateField("lastName") && isValid;
    isValid = validateField("email", true, false) && isValid;
    isValid = validateField("mobileNumber", false, true) && isValid;
    isValid = validateField("date") && isValid;
    isValid = validateGender() && isValid;
    isValid = validateField("qualification") && isValid;
    isValid = validateField("address") && isValid;
    isValid = validateField("country") && isValid;
    isValid = validateField("state") && isValid;
    isValid = validateField("city") && isValid;
    isValid = validateField("pin") && isValid;
  
    return isValid;
  }
  function validateEditForm() {
    const salutation = document.getElementById("editSalutation").value.trim();
    const firstName = document.getElementById("editFirstName").value.trim();
    const lastName = document.getElementById("editLastName").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const phone = document.getElementById("editMobileNumber").value.trim();
    const dobInput = document.getElementById("editdob");
    const dobError = document.getElementById("editdobError");
    const dobValue = dobInput.value.trim();
  
    const selectedGender = document.querySelector(
      'input[name="genderEdit"]:checked'
    );
    const genderError = document.getElementById("genderEditError");
    const qualifications = document.getElementById("editQualification").value.trim();
    const address = document.getElementById("editAddress").value.trim();
    const country = document.getElementById("editCountry").value.trim();
    const state = document.getElementById("editState").value.trim();
    const city = document.getElementById("editCity").value.trim();
    const pin = document.getElementById("editPin").value.trim();
  
    // regex validation
  
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^\d{10}$/;
    const namePattern = /^[A-Za-z]+$/;
  
    let isValid = true;
  
    if (salutation === "select") {
      document.getElementById("editSalutationError").textContent =
        "Invalid select";
      isValid = false;
    }
  
    if (!namePattern.test(firstName)) {
      document.getElementById("editFirstNameError").textContent =
        "First Name is required";
      isValid = false;
    }
  
    if (!namePattern.test(lastName)) {
      document.getElementById("editLastNameError").textContent =
        "Last Name is required";
      isValid = false;
    }
  
    if (!emailPattern.test(email)) {
      document.getElementById("editEmailError").textContent = "Invalid Email";
      isValid = false;
    }
  
    if (!phonePattern.test(phone)) {
      document.getElementById("EditMobileNumberError").textContent =
        "Invalid Phone Number";
      isValid = false;
    }
  
    if (dobValue === "") {
      dobError.textContent = "Date of Birth is required";F
      isValid = false;
    }
  
    if (selectedGender) {
      genderError.textContent = "";
    } else {
      genderError.textContent = "Please select a gender";
      isValid = false;
    }
  
    if (qualifications === "") {
      document.getElementById("editQualificationError").textContent =
        "Qualifications is required";
      isValid = false;
    }
  
    if (address === "") {
      document.getElementById("editAddressError").textContent =
        "Address is required";
      isValid = false;
    }
  
    if (country === "select country") {
      document.getElementById("editCountryError").textContent =
        "country is required";
      isValid = false;
    }
  
    if (state === "select state") {
      document.getElementById("editStateError").textContent = "state is required";
      isValid = false;
    }
  
    if (city === "") {
      document.getElementById("editCityError").textContent = "city is required";
      isValid = false;
    }
  
    if (pin === "") {
      document.getElementById("editPinError").textContent = "pin is required";
      isValid = false;
    }
  
    document.getElementById("editEmp").addEventListener("input", (event) => {
      DataName = event.target.id;
      let errorId = `${DataName}Error`;
      document.getElementById(errorId).textContent = "";
    });
  
    return isValid;
  }
  