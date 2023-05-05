const router = require("express").Router();
const indexController = require("../controller");
const {
  inviteControlAdmin,
  resetPasswordRequestController,
  resetPasswordController,
  signInControllerAdmin,
  signUpControllerAdmin,
  logoutControllerAdmin,
} = require("../controller/auth.controller");

// const {
//   getAdminNoticesController
// }= require("../controller")

const {
  getHistoryByReportId,
  postHistory,
} = require("../controller/adminHistory/history.controller");

router.get("/", async (req, res) => {
  res.json("health check");
});

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
router.put("/api/admin/reports/:id", indexController.updateReportStateById);
// notice
router.get("/api/admin/notices", indexController.getAdminNoticesController);
// notice
router.delete(
  "/api/admin/notices/:id",
  indexController.deleteAdminNoticesController
);

//categories
router.post("/api/admin/create/category", indexController.createCategory);
router.get("/api/admin/category/all", indexController.getAllCategories);
router.delete("/api/admin/category/delete/:id", indexController.deleteCategory);

//History
//get History by Report ID
router.get("/api/admin/history/:id", getHistoryByReportId);
//post New History (from admin)
router.post("/api/history", postHistory);

//user register -> not crypted
// router.post("/api/users/create/user", indexController.createUser);

//auth.controller
//because we will post new token on it
// router.post("/api/user/login", signInControllerUser);
router.post("/api/admin/login", signInControllerAdmin);

//admins

router.get("/api/admin/all", indexController.getAllAdmins);
router.post("/api/admin/update/:id", indexController.updateAdmin);
router.delete("/api/admin/delete/:id", indexController.deleteAdmin);

router.post("/api/admin/invite", inviteControlAdmin);
router.post("/api/admin/signup", signUpControllerAdmin);
router.delete("/api/admin/logout", logoutControllerAdmin);
router.post("/auth/requestResetPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);
router.get("/api/admin/:id", indexController.getAdminById);

module.exports = router;
