const express =  require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const { isAuth } = require("../authentication");
// const app = express();



router.get('/home' , isAuth ,  viewController.renderHome );                            //

router.get("/viewDetails" , isAuth , viewController.renderViewDetails);                   //, isAuth

router.get("/signUp", viewController.renderSignup);

router.get("/logIn", viewController.renderLogin);

router.get("/verifyOTP", viewController.renderVerifyOTP);


module.exports = router;