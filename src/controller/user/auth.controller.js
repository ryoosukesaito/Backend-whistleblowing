
const userPostLoginController = async (req, res, next) => {
  const { email, password } = req.body
  console.log(password)
  const signInService = await signIn(email, password)
  return res.json(signInService)
}

const userPostRegisterController = async (req, res, next) => {
    const signUpService = await signUp(req.body);
    return res.json(signUpService);
  };



const userPatchPasswordController = async (req, res, next) => {
    const {userId, currentPassword, newPassword} = req.body
    const changePasswordService = await changePassword(userId, currentPassword, newPassword)
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
    userPatchPasswordResetController
  };