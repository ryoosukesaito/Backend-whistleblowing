const mongoose = require("mongoose");
const { Schema, model} = mongoose;

const unreadSchema = new Schema({
   reportId: {
        type:Schema.Types.ObjectId,
        ref:"Report"
    
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' ,
        
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin' 
    },
    
})



const Unread = model('Unread', unreadSchema)
module.exports = Unread

