const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/email/sendEmail")
const User = require("../model/User")
const Token = require("../model/Token")
const Admin = require("../model/AdminAccount")
const AdminToken = require("../model/AdminToken")
const PasswordResetToken = require("../model/PasswordResetToken")

const { jwtSecret, salt, clientUrl, jwtExpiresIn } = require("../config");

// const signUp = async (data) => {
//     const { email } = data
//     let user = await User.findOne({ email })

//     if(user) throw new Error("Email already exists")

//     user = new User(data)

//     //generate a JWT token，token for sign up
//     const token = JWT.sign({ id: user._id }, jwtSecret)
//     await user.save()

//     return( data = {
//         userId: user._id,
//         email: user.email,
//         name: user.name,
//         token
//     })
// }

// Admin招待メール作成
const inviteAdmin=async(email,role)=>{

    // 同じメールアドレスですでにAdminアカウントが存在すればエラーをthrow
    const checkAdmin = await Admin.findOne({email:email})
    console.log(checkAdmin);
    if (checkAdmin)  throw new Error("email you sent is already exist")

    // AdminTokenスキーマのemailから引数で渡したemailと一致するものを探す
    const tokens = await AdminToken.find({email:email})

    // トークンtableに同じemailのトークンが既に登録済みであれば全て削除
    //　下で改めて新しいトークンを発行し招待メールを再送する
    if(tokens){
        tokens.forEach((token)=>{token.delete()})
    }

    // 32bitトークンの発行
    const tokenValue = crypto.randomBytes(32).toString("hex")
    // 発行したトークンのハッシュ化（暗号化）
    const hashedTokenValue = await bcrypt.hash(tokenValue, salt)

    // AdminTokenスキーマ(model)をemail,roleと上で発行したトークンをセットし生成する
    const newToken = new AdminToken({
        email:email,
        role:role,
        token:hashedTokenValue
    })
    // AdminTokenをDBに保存
    await newToken.save()

    // 招待メールに添付するURLを指定(front側登録画面のリンク)
    const link = `${clientUrl}/admins?token=${tokenValue}&email=${email}&role=${role}`

        // メール送信
        sendEmail(
            email,
            "You invited to CICCC-WHISLEBLOWING",
            { link:link },
            "./template/newAdminInvite.handlebars"
        )
    return {msg:"success"}
}


// Admin招待メールのリンクにアクセス後のpassword入力とDBへの本登録
// URLに含まれているtoken,email,と画面上で入力されたname,password
const signUpAdmin = async(token,email,name,password)=>{
    
    // AdminTokenスキーマ内のemailと引数で渡されたemailを照合
    const admintoken = await AdminToken.findOne({email:email})
    // tokenが一致するかの照合
    const isValid=await bcrypt.compare(token,admintoken.token)
    console.log(isValid);

    if(isValid){
        // tokenが一致した場合、一致したtokenに紐づいたemail,roleを取得
        const {email,role} = admintoken
        console.log(email);
        console.log(role);
        // Adminスキーマを生成
        const newAdmin = new Admin({
            name:name,
            email:email,
            password:password,
            role:role
        })
        //DBへ登録
        await newAdmin.save()
        // 登録完了のメールを送信
        sendEmail(
            email,
            "You Registered at CICCC-WHISLEBLOWING",
            { name:name },
            "./template/newAdminRegistered.handlebars"
        )

        // 招待メール送信時に作成したAdminTokenを削除
        admintoken.delete()
        return (data = {
            adminId: newAdmin._id,
            email: newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role,
        });
    }else{
        // トークンが見つからない
        throw new Error("something bad")
    }
}

// const signUpAdmin = async (data) => {
//     const { email } = data
//     let admin = await Admin.findOne({ email })
    // if(admin) throw new Error("Email already exists")

    // admin = new Admin(data)

    // //generate a JWT token，token for sign up
    // const token = JWT.sign({ id: admin._id }, jwtSecret)
    // await admin.save()

    // return( data = {
    //     adminId: admin._id,
    //     email: admin.email,
    //     name: admin.name,
    //     role: admin.role,
    //     token
    // })
// }


// const signInUser = async (email, password) => {
//     let user = await User.findOne({ email })

//     if(!user) throw new Error("User does not exists. Please try again")
// //bcrypt.compare() for checking
//     const isValid = await bcrypt.compare(password, user.password)
// //create token for sign in
//     const token = JWT.sign({ id: user._id}, jwtSecret)

//     if(isValid){
//         return (data = {
//             userId: user._id,
//             email: user.email,
//             name: user.name,
//             token
//         })
//     }else{
//         throw new Error("Incorrect credentials")
//     }
// }

const signInAdmin = async (email, password) => {
  let admin = await Admin.findOne({ email:email,deleteAt:'' });
  console.log(admin);
  if (!admin) throw new Error("Admin does not exists. Please try again");
  //bcrypt.compare() for checking
  const isValid = await bcrypt.compare(password, admin.password);
  //create token for sign in
  const token = JWT.sign({ id: admin._id }, jwtSecret);

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
  const token = await PasswordResetToken.findOne({ adminId: admin._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, salt);

  await new PasswordResetToken({
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
  const passwordResetToken = await PasswordResetToken.findOne({ adminId });
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
    // signUp,
    inviteAdmin,
    // signInUser,
    requestResetPassword,
    resetPassword,
    signInAdmin,
    signUpAdmin,
    logoutAdmin,
};
