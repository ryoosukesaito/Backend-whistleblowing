const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const bcrypt = require('bcryptjs')

const sendEmail = require("../../utils/email/sendEmail")
const User = require("../../model/User")
const Token = require("../../model/Token")

const {jwtSecret, salt, clientUrl} = require("../../config")



const signIn = async (email, password) => {
    console.log(password);

    let user = await User.findOne({ email })
    const LOGIN_ERR_MSG = "Incorect Email or Password. Please try again"
    
    // if(!user) throw new Error("Incorect Email or Password. Please try again")
    // Email登録チェック
    if(!user){
        const error = new Error(LOGIN_ERR_MSG)
        error.status = 404
        throw error
    }
    
    // bcryptを使ってDB上の登録情報との照合
    const isValid = await bcrypt.compare(password, user.password)
    // 対象user用のtokenを生成する
    const token = JWT.sign({ id: user._id}, jwtSecret)

    
    // 照合が成功した場合DB上のuserId、email,userNameと生成したtokenを返す
    if(isValid){
        return (data = {
            userId: user._id,
            email: user.email,
            name: user.name,
            token
        })
    }else{
        throw new Error(LOGIN_ERR_MSG)
    }
}



const signUp = async (data) => {
    const { email } = data
    let user = await User.findOne({ email })

    const SIGNUP_ERR_MSG = "Email already exists"
    if(user){ 
        const error =  new Error(SIGNUP_ERR_MSG)
        error.status = 400
        throw error
    }

    // userSchemaに沿った新しいuserを生成
    user = new User(data)

    // generate a JWT token
    // 新規登録後、ログイン画面に戻る(改めてログインが必要)
    // ↑仕様の為tokenは発行しない
    // const token = JWT.sign({ id: user._id }, jwtSecret)

    // 入力されたuser情報をDBに保存する
    await user.save()


    return( data = {
        userId: user._id,
        email: user.email,
        name: user.name,
    })
}


const requestResetPassword = async (email) => {
    const user = await User.findOne({email})
    if(!user) throw new Error("User does not exists")

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

    const isValid = await bcrypt.compare(token, passwordResetToken.token)

    if(!isValid) throw new Error("Invalid entry or the password reset has expired")

    const hash = await bcrypt.hash(newPassword, salt)

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