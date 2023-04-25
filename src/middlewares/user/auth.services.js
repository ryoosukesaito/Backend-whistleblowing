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
            _id: user._id,
            email: user.email,
            name: user.name,
            token
        })
    }else{
        throw new Error(LOGIN_ERR_MSG)
    }
}

const signOut = async(email)=>{
    let user = await User.findOne({email:email})
    if(user){
        return data=user
    }else{
        throw new Error("something bad")
    }
}



const signUp = async (name, email,password) => {
    let user = await User.findOne({ email })

    const SIGNUP_ERR_MSG = "Email already exists"
    if(user){ 
        const error =  new Error(SIGNUP_ERR_MSG)
        error.status = 400
        throw error
    }

    // userSchemaに沿った新しいuserを生成
    user = new User({
        name:name, 
        email:email,
        password:password
    })

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
    // 以前に再発行メールを送信していれば以前登録されたトークンは削除する
    if(token) await token.deleteOne()

    // 32bitトークンの発行
    const resetToken = crypto.randomBytes(32).toString("hex")
    // 発行したトークンのハッシュ化（暗号化）
    const hash = await bcrypt.hash(resetToken, salt)

    // DBに発行したトークンを登録（ユーザID、ハッシュ化したトークン、生成日時）
    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save()

    const link = `${clientUrl}/users/passwordreset?token=${resetToken}&id=${user._id}`
    // 8080/api/user/password/reset?token=""""""&id=&&&&&
    // 

    //send an email
    sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.name, link:link },
        "./template/requestResetPassword.handlebars"
    )

    return link
}

const changePassword = async(currentPassword, newPassword,token)=>{
    let tokenUserId
    await checkToken(token).then((targetUserId)=>{
        tokenUserId= targetUserId
    }).catch((error)=>{
        throw error
    })

    try {
        
        const targetUser = await User.findById(tokenUserId)

        const isValidPassword = await bcrypt.compare(currentPassword, targetUser.password)
        
        
        
        
            if(isValidPassword){
                targetUser.password = newPassword
                await targetUser.save()  
                return data={msg:"success"}
            }else{
                const error = new Error('invalid current password, please try again')
                error.status = 404
                throw error
            }
        } catch (error) {
            console.error(error);
        }
    }

const resetPassword = async (userId, token, newPassword) => {
    const databaseSideUserToken = await Token.findOne({ userId})
    
    if(!databaseSideUserToken) throw new Error("Invalid entry or the password reset has expired")
    
    const isValid = await bcrypt.compare(token, databaseSideUserToken.token)
    console.log(isValid);

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

    await databaseSideUserToken.deleteOne()

    return true
}

const checkToken = async(token)=>{

    if (!token) {
        const error = new Error('invalid token, please login first')
        error.status = 404
        throw error
    } else {
        try {
          let user = JWT.verify(token, jwtSecret);
          console.log(user);
          return user.id
          
        } catch {
            const error = new Error('invalid token, please login first')
            error.status = 404
            throw error

        }
      }
}

module.exports = {
    signUp,
    signIn,
    changePassword,
    requestResetPassword,
    resetPassword,
    checkToken,
    signOut
}