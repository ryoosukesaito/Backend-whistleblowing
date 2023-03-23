const User = require("../model/User");
const Report = require("../model/Report");

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
    res.status(200).json(saveUser);
  } catch (error) {
    console.error(error);
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params._id;
  console.log(id);
  const userFounddById = await User.findById(id);
  console.log(userFounddById);
  res.send(userFounddById);
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
    res.status(200).json(saveReport);
  } catch (error) {
    console.error(error);
  }
};

exports.getAllReports = async (req, res) => {
  const a = await Report.find({});
  console.log(a);
  res.send(a);
};

exports.getReportById = async (req, res) => {
  const id = req.params._id;
  console.log(id);
  const reportFounddById = await Report.findById(id).populate("userId");
  console.log(reportFounddById);
  res.send(reportFounddById);
};
