import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,'Enter your First Name']
    },

    lastName: {
        type: String,
        required: [true,'Enter your First Name']
    },
    
    password: {
        type: String,
        required: [true,'Enter a password'],
        minlength: 6,
        select: false
    },

    dateOfBirth: {
        type: Date,
        required: false,
    },

    role : {
        type: String,
        required: [true, 'Choose a user role (Staff, User or a Subscriber)'],
        enum: ['Staff', 'Intern', 'Subscriber', ]
    },
    isAdmin: {
        type: Boolean,
        default: false
    
    },

    skill:{
        type: String,
        required: false,
        default: ''
    },

    Created_at: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds: null
    },

    phoneNumber:[{type: String,
        required:[true, 'Enter a valid Phone Number'],
        minlength: 10,
        maxlength: 11 ////////////////////////////////////////
    }],

    duration:{type: Number
    },

    email:{
        type: String,
        required:[true, 'please provide a valid email'],
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please provide a valid email'
        ],
        collation: {
        locale : 'en',
        strength : 2
      },
        unique: [true, 'User exists']
    },

    avi:{
        type: String,
        required: false,
        default: ''
    },

    address:{
        type: String,
        required: false,
        default: ''
    },

    active:{
        type: Boolean,
        default: true
    },

    wifiLogin:{
        username: {
            type: String,
            default:''            
        },
        pass:{
            type: String,
            default:''
        },
        status:{
            type: String,
            enum: ['Not Active', 'Pending', 'Active', ]
        }
     },


    plan:{
        type: String,
        required: function(){
            if(this.position == 'Subscriber'){
                return true
            }else{
                return false
            }
        },
        enum:['Byte Plan','Kilobyte Plan','Megabyte Plan','Gigabyte Plan','Terabyte Plan', 'Virtual Office']//////////////////////////////////////////
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
        this.duration = 0
    }*/
    next()
        
    })


userSchema.methods.getSignedToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT} )
}

const User = mongoose.model('User', userSchema);


export {User}