const multer = require("multer");
const path = require("path");

// Set up storage for upload files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
// Create multer instance
const upload = multer({ storage }).single("image");



module.exports = upload;
