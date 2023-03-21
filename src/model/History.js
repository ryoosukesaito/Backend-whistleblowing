const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const historySchema = new Schema({
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

