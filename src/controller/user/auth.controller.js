
const {
  signIn,
  signUp,
  changePassword,
  requestResetPassword,
  resetPassword,
  signOut
} = require("../../middlewares/user/auth.services");


const userPostLoginController = async (req, res, next) => {
  const { email, password } = req.body
  console.log(password)
  const signInService = await signIn(email, password)
  return res.json(signInService)
}
const userPostLogoutController = async (req, res, next) => {
  const { email} = req.body
  const signOutService = await signOut(email)
  return res.json(signOutService)
}


const userPostRegisterController = async (req, res, next) => {
    const {name, email,password} = req.body
    const signUpService = await signUp(name, email,password);
    return res.json(signUpService);
  };



const userPatchPasswordController = async (req, res, next) => {
    const {currentPassword, newPassword} = req.body
    const token = req.header('x-auth-token');

    let changePasswordService 
    try {
      changePasswordService = await changePassword(currentPassword, newPassword,token)
      return res.status(200).json(changePasswordService)
      
    } catch (error) {
      
      throw error
    }
    return res.json(changePasswordService)
}


const userPostPasswordEmailController = async (req, res, next) => {
    const re = await requestResetPassword(req.body.email)
    console.log(re);

    return res.json({ message: "Please check your email for verification"})
}

const userPatchPasswordResetController = async (req, res, next) => {
    const { userId, token, password } = req.body
    const resetPasswordService = await resetPassword(userId, token, password)
    return res.json(resetPasswordService)
}

module.exports = {
    userPostLoginController,
    userPostRegisterController,
    userPatchPasswordController,
    userPostPasswordEmailController,
    userPatchPasswordResetController,
    userPostLogoutController
  };