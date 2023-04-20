const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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
        ref:'Image'
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

const Report = model('Report', reportSchema)
module.exports = Report

