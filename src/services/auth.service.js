const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const bcrypt = require('bcryptjs')

const sendEmail = require("../utils/email/sendEmail")
const User = require("../model/User")
const Token = require("../model/Token")

const {jwtSecret, salt, clientUrl} = require("../config")

const signUp = async (data) => {
    const { email } = data
    let user = await User.findOne({ email })

    if(user) throw new Error("Email already exists")

    user = new User(data)

    //generate a JWT token，token for sign up
    const token = JWT.sign({ id: user._id }, jwtSecret)
    await user.save()

    return( data = {
        userId: user._id,
        email: user.email,
        name: user.name,
        token
    })
}
const signIn = async (email, password) => {
    let user = await User.findOne({ email })

    if(!user) throw new Error("User does not exists. Please try again")
//bcrypt.compare() for checking
    const isValid = await bcrypt.compare(password, user.password)
//create token for sign in
    const token = JWT.sign({ id: user._id}, jwtSecret)

    if(isValid){
        return (data = {
            userId: user._id,
            email: user.email,
            name: user.name,
            token
        })
    }else{
        throw new Error("Incorrect credentials")
    }
}

const requestResetPassword = async (email) => {
    const user = await User.findOne({email})
    if(!user) throw new Error("User does not exists")

    //no matter what, delete the token either created when signup or signin
    const token = await Token.findOne({ userId: user._id })
    if(token) await token.deleteOne()

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hash = await bcrypt.hash(resetToken, salt)

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save()

    const link = `${clientUrl}/api/auth/passwordReset?token=${resetToken}&id=${user._id}`

    //send an email
    sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.name, link },
        "./template/requestResetPassword.handlebars"
    )

    return link
}

const resetPassword = async (userId, token, newPassword) => {
    const passwordResetToken = await Token.findOne({ userId})

    if(!passwordResetToken) throw new Error("Invalid entry or the password reset has expired")

    //use bcrypt to check
    const isValid = await bcrypt.compare(token, passwordResetToken.token)

    if(!isValid) throw new Error("Invalid entry or the password reset has expired")

    //encrypt the new password provided by user
    const hash = await bcrypt.hash(newPassword, salt)

    //second argument is the column you want to replace 
    await User.updateOne({ _id: userId }, { $set: { password: hash }})

    const user = await User.findById({ _id: userId })

    sendEmail(
        user.email,
        "Password Reset Successfully",
        { name: user.name },
        "./template/resetPassword.handlebars"
    )

    await passwordResetToken.deleteOne()

    return true
}

module.exports = {
    signUp,
    signIn,
    requestResetPassword,
    resetPassword
}