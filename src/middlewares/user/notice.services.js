const User = require("../../model/User")
const Report = require("../../model/Report")
const History = require("../../model/History")
const Unread = require("../../model/Unread")

const {checkToken} = require('./auth.services')


const getNotice = async (token)=>{
    console.log("notice");
    const targetUser = await checkToken(token)
    const unreads = await Unread.find({userId:targetUser})

    return data = unreads
}

const deleteNotice = async (token,id)=>{
    const targetUser = await checkToken(token)
    await Unread.findByIdAndDelete(id)
    
    return data={msg:"success"}
}
module.exports = {
    getNotice,
    deleteNotice
}
