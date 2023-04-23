const User = require("../../model/User")
const Report = require("../../model/Report")
const History = require("../../model/History")
const Unread = require("../../model/Unread")

const {checkToken} = require('./auth.services')


const getNotice = async (token)=>{
    const targetUser = await checkToken(token)
    const unreads = await Unread.find({userId:targetUser})

    return unreads
}

const deleteNotice = async (token)=>{
    const targetUser = await checkToken(token)
    await Unread.deleteMany({userId:targetUser})
    
    
}
module.exports = {
    getNotice,
    deleteNotice
}
