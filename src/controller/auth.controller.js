const {
  signUp,
  signInUser,
  inviteAdmin,
  requestResetPassword,
  resetPassword,
  signInAdmin,
  signUpAdmin,
  logoutAdmin,
} = require("../services/auth.service");

  
  const signUpController = async (req, res, next) => {
    const signUpService = await signUp(req.body);
    return res.json(signUpService);
  };

  const inviteComtrollerAdmin = async(req,res,next)=>{
    const {email,role} = req.body
    const inviteService = await inviteAdmin(email,role)
    return res.json(inviteService)
  }

  const signUpControllerAdmin = async (req, res, next) => {
    // const signUpService = await signUpAdmin(req.body);
    const {token,email,name,password} = req.body

    const signUpService = await signUpAdmin(token,email,name,password)
    return res.json(signUpService);
  };
  
  const signInControllerUser = async (req, res, next) => {
      const { email, password } = req.body
      const signInService = await signInUser(email, password)
      return res.json(signInService)
  }

const signInControllerAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email + "----" + password);
  const signInService = await signInAdmin(email, password);
  return res.json(signInService);
};

const logoutControllerAdmin = async (req, res, next) => {
  try {
    const { adminId, token } = req.body;
    const admin = await logoutAdmin(adminId, token);
    res.status(200).send(admin);
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
};

const resetPasswordRequestController = async (req, res, next) => {
  const re = await requestResetPassword(req.body.email);
  console.log(re);

  return res.json({ message: "Please check your email for verification" });
};

const resetPasswordController = async (req, res, next) => {
  const { adminId, token, password } = req.body;
  const resetPasswordService = await resetPassword(adminId, token, password);
  return res.json(resetPasswordService);
};

module.exports = {
  signUpController,
  signInControllerUser,
  inviteComtrollerAdmin,
  resetPasswordRequestController,
  resetPasswordController,
  signInControllerAdmin,
  signUpControllerAdmin,
  logoutControllerAdmin,
};
