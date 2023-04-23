const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// const AES = require("crypto-js/aes");
// const SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

const reportSchema = new Schema({
    userName:{
        type: String,
            },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User' ,
        // required: true,
    },
    
    userDepartment:{
        type: String,        
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin' 
    },
    subject:{
        type: String, 
        required: true       
    },
    category_id:{
        type: Schema.Types.ObjectId,
        ref: 'Category' ,
        // required: true 
    },
    description:{
        type: String, 
        required: true       
    },
    file:{
        type: Schema.Types.ObjectId,
        ref:'uploads.files'
    },
    status:{
        type: String,
        required: true,
        default:"Not started"
    },
    histories:{
        type: [Schema.Types.ObjectId],
        // required: true,
        ref: 'History'   
    },    
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: Date,
    deleteAt: Date
})

reportSchema.pre('save', function(next){
    // console.log(this);
    const reports = this
    reports.updatedAt = Date.now()
    next()
})

reportSchema.pre("save", async function(next){
    if(!this.isModified("description")) return next()

    const hash = await CryptoJS.AES.encrypt(this.description, 'secret key 123').toString();

    this.description = hash
    next()
})





const Report = model('Report', reportSchema)
module.exports = Report

