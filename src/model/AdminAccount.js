const mongoose = require("mongoose");
const { Schema, model, SchemaType} = mongoose;

const AdminSchema = new Schema({
   
    reportId: {
        type: SchemaType.objectId,
        ref: 'Report' ,
        required: true,
    },
    userDepartment: {
        type: String,        
    },
    adminId: {
        type: SchemaType.objectId,
        ref: 'Admin' 
    },
    subject: {
        type: String, 
        required: true       
    },
    category_id :{
        type: SchemaType.objectId,
        ref: 'Category' ,
        required: true 
    },
    description: {
        type: String, 
        required: true       
    },
    file:{
        type: String
    },
    status:{
        type: String,
        required: true   
    },
    histories:{
        type: SchemaType.objectId,
        required: true,
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

AdminSchema.pre('save', function(next){
    // console.log(this);
    const Admin = this
    Admin.updatedAt = Date.now()
    next()
})

const Admin = model('Admin', AdminSchema)
module.exports = Admin

