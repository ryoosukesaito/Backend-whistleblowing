const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const CryptoJS = require("crypto-js")
const {
    cryptoSecret
  } = require("../config");

const historySchema = new Schema({
    reportId: {
        type:Schema.Types.ObjectId,
        ref:"Report",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' ,
        
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin' 
    },
    
    name: {
        type: String,  
        required: true       
    },
    message: {
        type: String,  
        required: true       
    },
   
    replierType: {
        type: String, 
        required: true       
    },

     file:{
        type: String
    },
    
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: Date,
    deleteAt: Date
})

historySchema.pre('save', function(next){
    // console.log(this);
    const history = this
    history.message = CryptoJS.AES.encrypt(history.message,cryptoSecret).toString()
    history.updatedAt = Date.now()
    next()
})

historySchema.pre('deleteOne', function(next){
    // console.log(this);
    const history = this
    history.deleteAt = Date.now()
    next()
})

const History = model('History', historySchema)
module.exports = History

