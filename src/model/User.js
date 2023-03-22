const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Report = require("./Report")

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    NameforReport:{
        type: Schema.Types.ObjectId,
        ref: 'Report'
    }
    ,
    email: {
        type: String,
        // minlength: 10,
        required: true,
        lowercase: true,
        unique:true
    },
    password: {
        type: String,
        minlength: 10,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: Date,
    deleteAt: Date
})

userSchema.pre('save', function(next){
    // console.log(this);
    const user = this
    user.updatedAt = Date.now()
    next()
})

const User = model('User', userSchema)
module.exports = User

