import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,'']
    },

    lastName: {
        type: String,
        required: [true,'']
    },
    
    password: {
        type: String,
        required: [true,''],
        minlength: 6,
        select: false
    },

    dateOfBirth: {
        type: Date,
        required: false,
    },

    position : {
        type: String,
        required: [true, ''],
        enum: ['Staff', 'Intern', 'Subscriber',]
    },
    isAdmin: {
        type: Boolean,
        default: false
    
    },

    role:{
        type: String,
        required: false,
        default: ''
    },

    Created_at: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds: null
    },

    phoneNumber:[{type: Number,
        required:[true, ''],
        minlength: 10,
        maxlength: 11 ////////////////////////////////////////
    }],

    subscribtionInMonths:{type: Number
    },

    email:{type: String,
        required:[true, ''],
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please provide a valid email'
    ]
    },

    avi:{
        type: String,
        required: false,
        default: ''
    }

});



userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    
    if(this.position === "Subscriber"){
        this.Created_at.expireAfterSeconds = 60*60*24*30*this.subscribtion
    }/*else{
        this.Created_at.expireAfterSeconds = Number.POSITIVE_INFINITY
        this.subscribtionInMonths = 0
    }*/
    next()
        
    })


userSchema.methods.getSignedToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT} )
}

const User = mongoose.model('User', userSchema);


export {User}