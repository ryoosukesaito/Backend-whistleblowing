const mongoose = require("mongoose");
const { Schema, model} = mongoose;

const AdminSchema = new Schema({
   
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'Report' ,
        
    },
      
    category_id :{
        type: Schema.Types.ObjectId,
        ref: 'Category' ,
       
    },
    histories:{
        type: Schema.Types.ObjectId,
        ref: 'History'   
    },    
    name: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        // minlength: 10,
        required: true,
        lowercase: true,
        unique:true
    },
    password: {
        type: String,
        // minlength: 10,
        required: true
    },
    role: {
        type: String,
        required: true,
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

