const express = require("express");
const errorHandler = require("./middlewares/errorHandlers");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const ejs = require('ejs');
const path = require('path');
const { sessionMid } = require("./authentication");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;
const app = express();
connectDb();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(sessionMid);

// MiddleWare for static files
app.use("/uploads",express.static(path.resolve(__dirname, 'uploads')));
app.use(express.static('assets'));

// setting Ejs as the view engine
app.set('view engine' , 'ejs');
// set the directory
app.set('views', path.join(__dirname, 'view'));


// routes setup and Importing routes
app.use('/api/employees', require("./routes/employeeRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("", require("./routes/viewRoutes"));



// error handling middleware
app.use(errorHandler);



app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});