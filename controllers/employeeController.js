const asyncHandler = require("express-async-handler");
const Employees = require("../models/employeeModel");
const upload = require('../config/multer');
const multer = require("multer");
const path = require("path");


// @desc Get all employees
// @routes GET /api/employees
//@access private

const  getEmployees = asyncHandler(async (req, res) => {
    let{page, size} = req?.query;
    let limit = 10000000;
    let skip = 0;

    if (size) limit = parseInt(size);
    if (size && page) skip = (page - 1) * size;

    const Totalemployees = await Employees.find();
    const employees = await Employees.find().sort({createdAt: -1}).limit(limit).skip(skip);
     return res.status(200).json({Totalemployees, employees});


});


// @desc Get employee
// @routes GET /api/employees/:id
//@access private

const getEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await Employees.findById(employeeId);
        if (!employee) {
            res.status(400);
            throw new Error("Employee not found!!");
        }
        // return employee;
        res.status(200).json(employee);
    }
    catch {
        console.log("Error in fetch by ID");
    }

});

// @desc Add employee
// @routes POST /api/employees
//@access private

const addEmployee = asyncHandler( async( req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).json({ message: "Image upload error" });
        } else if (err) {
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            console.log("The request body is :", req.body);

            const {
                salutation,
                firstName,
                lastName,
                email,
                mobileNumber,
                date,
                gender,
                qualification,
                address,
                country,
                state,
                city,
                pin } = req.body;

            const imagepath = req.file ? req.file.path : null;
            
            if (
                !salutation ||
                !firstName ||
                !lastName ||
                !email ||
                !mobileNumber ||
                !date ||
                !gender ||
                !qualification ||
                !address ||
                !country ||
                !state ||
                !city ||
                ! pin                
              ){
                console.error('Missing fields:', { salutation, firstName, lastName, email, mobileNumber, date, gender, qualification, address, country, state, city, pin });
                return res.status(400).json({message:"Some fields are missing"});
            
            }

            try {
                

                const employees = await Employees.create({
                    salutation,
                    firstName,
                    lastName,
                    email,
                    mobileNumber,
                    date,
                    gender,
                    qualification,
                    address,
                    country,
                    state,
                    city,
                    pin,
                    username: firstName,
                    password: mobileNumber,
                    image: imagepath,
                });
                console.log("Employee added successfully");
                return res.status(201).json(employees);
            } catch {
                return res.status(500).json({ message: "Error in POST" });
               
            }
        }
    });
});



// @desc Edit employee
// @routes PUT /api/employees/:id
//@access private

const editEmployee = asyncHandler(async (req, res) => {

    upload(req, res, async(error) =>{

        if(error instanceof multer.MulterError){
            return res.status(400).json({error: "Image upload error:" + error.message});
        }else if(error) {
            return res.status(500).json({error: "Internal Server Error"});
        }
        let imagepath;

        if(req.file){
            imagepath  = path.join("uploads", req.file.filename);
        } else{
            // if no file is upload, keep the already existing image path
            const employee = await Employees.findById(req.params.id);

            if (!employee) {
                res.status(404);
                throw new Error("Employee not found!!");
            }
            // use the already existing image path
            imagepath = employee.image;
        }

        // update image only if a new file was uploaded
        const updateData = {
            ...req.body,
            ...(imagepath ? {image: imagepath} : {}), // condition to include image
        };
        console.log(imagepath);

        const updatedData = await Employees.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true });
        return res.status(200).json(updatedData);
    });
});


// @desc Delete employee
// @routes DELETE /api/employees/:id
//@access private

const deleteEmployee = asyncHandler(async (req, res) => {

    const employee = await Employees.findById(req.params.id);
    if (!employee) {
        res.status(404);
        throw new Error("Employee not found!!");
    }

    await Employees.findByIdAndDelete(req.params.id);
    res.status(200).json(employee);
});

// Search-method ---start
const searchEmployee = asyncHandler( async (req,res) => {
    const employee = await Employees.find({
        $or: [
            { firstName: { $regex: req.params.key, $options: "i" } },
             { lastName: { $regex: req.params.key, $options: "i" } },
             { email: { $regex: req.params.key, $options: "i"} },
        ],
    });
    if(!employee) {
        res.status(404);
        throw new Error("Employee not found");
    }
    res.status(200).json({ employee });
});



module.exports = {
    getEmployees,
    addEmployee,
    getEmployee,
    editEmployee,
    deleteEmployee,
    searchEmployee
}