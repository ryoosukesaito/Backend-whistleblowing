const router = require("express").Router();
// この下後で消す
const Unread = require("../model/Unread")
const Report = require("../model/Report")
const Admin = require("../model/AdminAccount")

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
router.post("/login", userPostLoginController);
// user sign up api
router.post("/register",userPostRegisterController);
// user password change from header api
router.patch("/password",userPatchPasswordController);
// user send forgot passsword email api
router.post("/password/email", userPostPasswordEmailController);
// user reset password from email api
router.patch("/password/reset", userPatchPasswordResetController);

//reports
// passing of report data tied to logged-in users
router.get("/reports", userGetReportsController);
// user post new report
router.post("/reports", userPostReportsController);
// user get report detail
router.get("/reports/:id", userGetReportByIdController);
// user create new history
router.put("/reports/:id", userPutReortHistoryController);

//notice
// user count notice api
router.get("/notice", userGetNoticeController);
// user delete notice api
router.delete("/notice", userDeleteNoticeController);


router.get("/test",(req, res) => {
    console.log("USER TEST!")
    res.send('USER TEST!')
  })

router.post("/notice",(req,res)=>{
    const {reportId,userId}=req.body
    const unread = new Unread({
        reportId:reportId,
        userId:userId
    })
    unread.save()
    res.send('done')
})


module.exports = router;
