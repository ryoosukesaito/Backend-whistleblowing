
const User = require("../model/User");
const Report = require("../model/Report");
const Admin = require("../model/AdminAccount")
const Category = require("../model/Category")


//user
exports.getAllUsers = async (req,res) => {
  const a = await User.find({})
  console.log(a)
  res.send(a)
 }

exports.createUser = async (req, res) => {
  const {name , email, password} = req.body
  const newUser = new User({name,email,password})
 
  try {
    const saveUser= await newUser.save();
    console.log("new User has been added successfully")

    res.status(200).json(saveUser)

  } catch (error) {
    console.error(error);
  }
};

exports.getUserById = async (req,res) => {
  const id = req.body._id
  const userFounddById = await User.findById(id)
  console.log(userFounddById)
  res.send(userFounddById)
 }


 // login

exports.getOneByEmail = async (req,res) => {
  const a = await User.findOne({ email : req.body.email})
  console.log(a)
  res.send(a)
 }

 exports.getOneByPassword = async (req,res) => {
  const a = await User.findOne({ password : req.body.password})
  console.log(a)
  res.send(a)
 }


//  report

 exports.createReport = async (req, res) => {
  const {userName , userId, userDepartment,adminId,subject,category_id,description,file,status,histories} = req.body
  const newReport = new Report({userName , userId, userDepartment,adminId,subject,category_id,description,file,status,histories})
 
  try {
    const saveReport= await newReport.save();
    console.log("new Report has been added successfully")

    res.status(200).json(saveReport)

  } catch (error) {
    console.error(error);
  }
};


exports.getAllReports = async (req,res) => {
  const a = await Report.find({})
  console.log(a)
  res.send(a)
 }


 exports.getReportById = async (req,res) => {
  const id = req.body._id
  const reportFounddById = await Report.findById(id).populate('userId')
  console.log(reportFounddById)
  res.send(reportFounddById)
 }


//admin

exports.createAdmin = async (req, res) => {
  const {name , email, password ,role} = req.body
  const newAdmin = new Admin({name,email,password ,role})
 
  try {
    const saveAdmin= await newAdmin.save();
    console.log("new Admin has been added successfully")
    res.status(200).json(saveAdmin)

  } catch (error) {
    console.error(error);
  }
};

exports.getAllAdmins = async (req,res) => {
  const a = await Admin.find({})
  console.log(a)
  res.send(a)
 }

 exports.getAdminById = async (req,res) => {
  const id = req.body._id
  const adminFounddById = await Admin.findById(id)
  console.log(adminFounddById)
  res.send(adminFounddById)
 }

 exports.updateAdmin = async (req,res) => {
  const id = req.body._id
  const {name , email, password ,role} = req.body

  const adminFounddById = await Admin.findById(id)
  console.log(adminFounddById)
 
  adminFounddById.name = name
  adminFounddById.email = email
  adminFounddById.password = password
  adminFounddById.role = role

  await adminFounddById.save()
  console.log(adminFounddById)

  res.send(adminFounddById)
 }

 exports.deleteAdmin = async (req,res)=>{
  const id = req.body._id
  const adminDeleted = await Admin.deleteOne({"_id" : id})

  if (adminDeleted.deletedCount !== 0) {
    console.log ("Category has been deleted")
  }

  res.send (adminDeleted)
 }


 //category

 exports.createCategory = async (req, res) => {
  const {name} = req.body
  const newCategory = new Category({name})
 
  try {
    const saveCategory= await newCategory.save();
    console.log("new Category has been added successfully")
    res.status(200).json(saveCategory)

  } catch (error) {
    console.error(error);
  }
};

exports.getAllCategorys = async (req,res) => {
  const a = await Category.find({})
  console.log(a)
  res.send(a)
 }

 exports.deleteCategory = async (req,res)=>{
  const id = req.body._id
  const CategoryDeleted = await Category.deleteOne({"_id" : id})

  if (CategoryDeleted.deletedCount !== 0) {
    console.log ("Category has been deleted")
  }

  res.send (CategoryDeleted)
 }