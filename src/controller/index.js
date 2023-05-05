const User = require("../model/User");
const Report = require("../model/Report");
const Admin = require("../model/AdminAccount");
const Category = require("../model/Category");
const Unread = require("../model/Unread");
const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { cryptoSecret, jwtSecret } = require("../config");
//user
exports.getAllUsers = async (req, res) => {
  const a = await User.find({});
  console.log(a);
  res.send(a);
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });

  try {
    const saveUser = await newUser.save();
    console.log("new User has been added successfully");

    res.status(200).json(saveUser);
  } catch (error) {
    console.error(error);
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  const userFoundById = await User.findById(id);
  console.log(userFoundById);
  res.send(userFoundById);
};

// login

exports.getOneByEmail = async (req, res) => {
  const a = await User.findOne({ email: req.body.email });
  console.log(a);
  res.send(a);
};

exports.getOneByPassword = async (req, res) => {
  const a = await User.findOne({ password: req.body.password });
  console.log(a);
  res.send(a);
};

//  report

exports.createReport = async (req, res) => {
  const {
    userName,
    userId,
    userDepartment,
    adminId,
    subject,
    category_id,
    description,
    file,
    status,
    histories,
  } = req.body;
  const newReport = new Report({
    userName,
    userId,
    userDepartment,
    adminId,
    subject,
    category_id,
    description,
    file,
    status,
    histories,
  });

  try {
    const saveReport = await newReport.save();
    console.log("new Report has been added successfully");

    res.status(200).json(saveReport);
  } catch (error) {
    console.error(error);
  }
};

exports.getAllReports = async (req, res) => {
  const a = await Report.find({})
    .populate("adminId")
    .populate("category_id")
    .sort({ createdAt: -1 });
  a.forEach((report) => {
    report.subject = CryptoJS.AES.decrypt(
      report.subject,
      cryptoSecret
    ).toString(CryptoJS.enc.Utf8);
    report.description = CryptoJS.AES.decrypt(
      report.description,
      cryptoSecret
    ).toString(CryptoJS.enc.Utf8);
  });
  // console.log(a);
  res.send(a);
};

exports.getReportById = async (req, res) => {
  const id = req.params.id;
  const reportFoundById = await Report.findById(id)
    .populate("category_id")
    .populate("adminId");

  reportFoundById.subject = CryptoJS.AES.decrypt(
    reportFoundById.subject,
    cryptoSecret
  ).toString(CryptoJS.enc.Utf8);
  reportFoundById.description = CryptoJS.AES.decrypt(
    reportFoundById.description,
    cryptoSecret
  ).toString(CryptoJS.enc.Utf8);
  res.send(reportFoundById);
};

exports.updateReportStateById = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  console.log(status);
  try {
    await Report.findByIdAndUpdate(id, {
      status: status,
    });
    res.send({ msg: "success" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//admin

exports.createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const newAdmin = new Admin({ name, email, password, role });

  try {
    const saveAdmin = await newAdmin.save();
    console.log("new Admin has been added successfully");
    res.status(200).json(saveAdmin);
  } catch (error) {
    console.error(error);
  }
};

exports.getAllAdmins = async (req, res) => {
  const a = await Admin.find({ deleteAt: "" });
  res.send(a);
};

exports.getAdminById = async (req, res) => {
  const id = req.params.id;
  const adminFoundById = await Admin.findById(id);
  console.log(adminFoundById);
  res.send(adminFoundById);
};

exports.updateAdmin = async (req, res) => {
  const id = req.body._id;
  const { name, email } = req.body;

  const adminFoundById = await Admin.findById(id);

  adminFoundById.name = name;
  adminFoundById.email = email;

  await adminFoundById.save();
  console.log(adminFoundById);

  res.status(201).send(adminFoundById);
};

exports.deleteAdmin = async (req, res) => {
  const id = req.params.id;
  const today = Date.now();
  console.log(id);
  console.log(today);
  try {
    await Admin.findByIdAndUpdate(id, { deleteAt: today });
  } catch (error) {
    console.error(error);
  }
  console.log("Admin has been deleted");
  res.send(adminDeleted);
};

//category

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });

  try {
    const saveCategory = await newCategory.save();
    console.log("new Category has been added successfully");
    res.status(200).json(saveCategory);
  } catch (error) {
    console.error(error);
  }
};

exports.getAllCategories = async (req, res) => {
  const a = await Category.find({ deleteAt: "" });
  res.send(a);
};

exports.deleteCategory = async (req, res) => {
  const id = req.body._id;
  const today = Date.now();
  try {
    await Category.findByIdAndUpdate(id, { deleteAt: today });
  } catch (error) {
    console.log(error);
  }

  console.log("Category has been deleted");

  res.send(CategoryDeleted);
};
exports.getAdminNoticesController = async (req, res) => {
  const token = req.header("x-auth-token");
  console.log(token);
  if (token) {
    const admin = await JWT.verify(token, jwtSecret);
    const notices = await Unread.find({ adminId: admin.id });
    const resData = [];
    if (notices) {
      for (const notice of notices) {
        const subject = await getSubjectByReportId(notice.reportId);
        resData.push({
          id: notice.id,
          reportId: notice.reportId,
          subject: subject,
        });
      }
    }
    return res.send((data = resData));
  } else {
    throw new Error("something bad");
  }
};
exports.deleteAdminNoticesController = async (req, res) => {
  try {
    await Unread.findByIdAndDelete(req.params.id);
    console.log("delete");
    res.send((data = { msg: "success" }));
  } catch (error) {
    throw error;
  }
};
const getSubjectByReportId = async (reportId) => {
  const report = await Report.findById(reportId);
  if (report) {
    const subject = CryptoJS.AES.decrypt(report.subject, cryptoSecret).toString(
      CryptoJS.enc.Utf8
    );
    return subject;
  } else {
    return "Not Found Report";
  }
};
