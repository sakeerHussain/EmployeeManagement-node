const mongoose = require("mongoose");


const employeeSchema = mongoose.Schema({
   
    salutation: {
        type: String,
        required: [true, "Please add employee salutation"],
    },
    firstName: {
        type: String,
        required:[true, "Please add employee first name"],
    },
    lastName: {
        type: String,
        required:[true, "Please add employee last name"],
    },
    email:{
        type: String,
        required: [true, "please add the employee email address"],
    },
    mobileNumber:{
        type: String,
        required: [true, "Please add the employee phone number"],
    },
    date:{
        type: String,
        required: [true, "Please add employee date of birth"],
    },
    gender:{
        type: String,
        required: [true,"Please add employee gender"],
    },
    qualification:{
        type: String,
        required: [true,"Please add the employee qualification"],
    },
    address:{
        type: String,
        required: [true,"Please add the employee address"],
    },
    country:{
        type: String,
        required: [true,"Please add the employee country"],
    },
    state:{
        type: String,
        required: [true,"Please add the employee state"],
    },
    city:{
        type: String,
        required: [true,"Please add the employee city"],
    },
    pin:{
        type: String,
        required: [true,"Please add the employee pin"],
    },
    username:{
        type: String,
        required: [true,"Please add the employee username"],
        // default: ""
    },
    password:{
        type: String,
        required: [true,"Please add the employee password"],
    },
    image: {
        type: String,
        required: [true, "Please add the employee image"],
    },
    

},
{
    timestamps: true,
}
);


module.exports = mongoose.model("employees", employeeSchema); 