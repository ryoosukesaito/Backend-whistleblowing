const router = require("express").Router();
const indexController = require('../controller')


router.get("/api/admin/users", indexController.getAllUsers);
router.get("/api/admin/users/:id", indexController.getUserById);
router.post("/api/admin/create/user", indexController.createUser);

router.get("/api/login/findbyemail", indexController.getOneByEmail);
router.get("/api/login/findbypassword", indexController.getOneByPassword);

router.post("/api/admin/create/report", indexController.createReport);
router.get("/api/admin/reports", indexController.getAllReports);


router.get("/api/admin/reports/:id", indexController.getReportById);



module.exports = router;