const router = require("express").Router();

const {
    userPostLoginController,
    userPostRegisterController,
    userPatchPasswordController,
    userPostPasswordEmailController,
    userPatchPasswordResetController
} = require("../controller/user/auth.controller");

const {
    userGetNoticeController,
    userDeleteNoticeController
} = require("../controller/user/notice.controller");


const {
    userGetReportsController,
    userPostReportsController,
    userGetReportByIdController,
    userPutReortHistoryController
} = require("../controller/user/reports.controller");


//auth
// user login api
router.post("/api/user/login", userPostLoginController);
// user sign up api
router.post("/api/user/register",userPostRegisterController);
// user password change from header api
router.patch("/api/user/password",userPatchPasswordController);
// user send forgot passsword email api
router.post("/api/user/password/email", userPostPasswordEmailController);
// user reset password from email api
router.patch("/api/user/password/reset", userPatchPasswordResetController);


//notice
// user count notice api
router.get("/api/user/notice", userGetNoticeController);
// user delete notice api
router.delete("/api/user/notice", userDeleteNoticeController);


//reports
// passing of report data tied to logged-in users
router.get("/api/user/reports", userGetReportsController);
// user post new report
router.post("/api/user/reports", userPostReportsController);
// user get report detail
router.get("/api/user/reports/:id", userGetReportByIdController);
// user create new history
router.put("/api/user/reports", userPutReortHistoryController);



module.exports = router;
