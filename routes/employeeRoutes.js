const express = require("express");
const router = express.Router();

const { getEmployees,
        addEmployee,
        getEmployee, 
        editEmployee,
        deleteEmployee,
        searchEmployee
    } = require("../controllers/employeeController");
// const validationToken = require("../middleware/validateTokenHandler");
       
router.route("/").get(getEmployees);
router.route("/").post(addEmployee);
router.route("/:id").get(getEmployee);
router.route("/:id").put(editEmployee);
router.route("/:id").delete(deleteEmployee);
router.route("/search/:key").get(searchEmployee)



module.exports = router;