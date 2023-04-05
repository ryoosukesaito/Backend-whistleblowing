const router = require("express").Router();
const indexController = require('../controller')
const {
    signUpController,
    signInControllerUser,
    resetPasswordRequestController,
    resetPasswordController,
    signInControllerAdmin,
    signUpControllerAdmin
  } = require("../controller/auth.controller");

router.get("/", async (req,res) => { res.json("health check")  })


//user list
router.get("/api/admin/users/all", indexController.getAllUsers);
router.get("/api/admin/users/:id", indexController.getUserById);


//users login with email and password
router.get("/api/login/findbyemail", indexController.getOneByEmail);
router.get("/api/login/findbypassword", indexController.getOneByPassword);

//report list
router.post("/api/admin/create/report", indexController.createReport);
router.get("/api/admin/reports", indexController.getAllReports);
router.get("/api/admin/reports/:id", indexController.getReportById);

//admins
// router.post("/api/admin/create/admin", indexController.createAdmin);
router.get("/api/admin/all", indexController.getAllAdmins);
router.get("/api/admin/:id", indexController.getAdminById);
router.post("/api/admin/update/:id", indexController.updateAdmin);
router.delete("/api/admin/delete/:id", indexController.deleteAdmin);


//categories
router.post("/api/admin/create/category", indexController.createCategory);
router.get("/api/admin/category/all", indexController.getAllCategorys);
router.delete("/api/admin/category/delete/:id", indexController.deleteCategory);


//user register -> not crypted
// router.post("/api/users/create/user", indexController.createUser);

//auth.controller
//because we will post new token on it
router.post("/api/user/login", signInControllerUser);
router.post("/api/admin/login", signInControllerAdmin);
router.post("/api/user/signup", signUpController);
router.post("/api/admin/signup", signUpControllerAdmin);
router.post("/auth/requestResetPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);


module.exports = router;