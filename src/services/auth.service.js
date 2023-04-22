const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/email/sendEmail");
const User = require("../model/User");
const Token = require("../model/Token");
const TokenAdmin = require("../model/TokenAdmin");
const Admin = require("../model/AdminAccount");

const { jwtSecret, salt, clientUrl, jwtExpiresIn } = require("../config");

const signUp = async (data) => {
  const { email } = data;
  let user = await User.findOne({ email });

  if (user) throw new Error("Email already exists");

  user = new User(data);

  //generate a JWT token，token for sign up
  const token = JWT.sign({ id: user._id }, jwtSecret);
  await user.save();

  return (data = {
    userId: user._id,
    email: user.email,
    name: user.name,
    token,
  });
};

const signUpAdmin = async (data) => {
  const { email } = data;
  let admin = await Admin.findOne({ email });

  if (admin) throw new Error("Email already exists");

  admin = new Admin(data);

  //generate a JWT token，token for sign up
  const token = JWT.sign({ id: admin._id }, jwtSecret);
  await admin.save();

  return (data = {
    adminId: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    token,
  });
};

const signInUser = async (email, password) => {
  let user = await User.findOne({ email });

  if (!user) throw new Error("User does not exists. Please try again");
  //bcrypt.compare() for checking
  const isValid = await bcrypt.compare(password, user.password);
  //create token for sign in
  const token = JWT.sign({ id: user._id }, jwtSecret);

  if (isValid) {
    return (data = {
      userId: user._id,
      email: user.email,
      name: user.name,
      token,
    });
  } else {
    throw new Error("Incorrect credentials");
  }
};

const signInAdmin = async (email, password) => {
  let admin = await Admin.findOne({ email });
  console.log(admin);
  if (!admin) throw new Error("Admin does not exists. Please try again");
  //bcrypt.compare() for checking
  const isValid = await bcrypt.compare(password, admin.password);
  //create token for sign in
  const token = JWT.sign({ id: admin._id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  if (isValid) {
    return (data = {
      adminId: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      token,
    });
  } else {
    throw new Error("Incorrect credentials");
  }
};

const logoutAdmin = async (adminId, token) => {
  const admin = await Admin.findOne({ _id: adminId });

  if (admin) {
    return admin;
  }
};

const requestResetPassword = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("User does not exists");

  //no matter what, delete the token either created when signup or signin
  const token = await TokenAdmin.findOne({ adminId: admin._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, salt);

  await new TokenAdmin({
    adminId: admin._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientUrl}/api/auth/passwordReset?token=${resetToken}&id=${admin._id}`;

  //send an email
  sendEmail(
    admin.email,
    "Password Reset Request",
    { name: admin.name, link },
    "./template/requestResetPassword.handlebars"
  );

  return link;
};

const resetPassword = async (adminId, token, newPassword) => {
  const passwordResetToken = await TokenAdmin.findOne({ adminId });
  if (!passwordResetToken) throw new Error("The password reset has expired");

  //use bcrypt to check
  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid)
    throw new Error("Invalid entry or the password reset has expired");

  //encrypt the new password provided by user
  const hash = await bcrypt.hash(newPassword, salt);

  //second argument is the column you want to replace
  await Admin.updateOne({ _id: adminId }, { $set: { password: hash } });

  const admin = await Admin.findById({ _id: adminId });

  sendEmail(
    admin.email,
    "Password Reset Successfully",
    { name: admin.name },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return true;
};

module.exports = {
  signUp,
  signInUser,
  requestResetPassword,
  resetPassword,
  signInAdmin,
  signUpAdmin,
  logoutAdmin,
};
