import {User as user} from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const login = async (req, res, next) =>{
  const {login, password} = req.body

  if (!login || !password){
    res.json({
        sucess: false,
        message: "provide a username and a password"

    }) 
    return
}
  let _user 
  await user.findOne()
        .or([{email: login}, {phoneNumber: login}])
        .select("+password")
        .then(user=>{
            user = _user
        })
        .catch(err=>{
            res.status(400).json({
                success: false,
                message: "User does not exist"
            })
            return
        })



   try {
        if (!_user){
            res.status(400).json({
                success: false,
                message: "Invalid Details"
            })
            return
        }
        
        bcrypt.compare(password, _user.password).then((isMatch) =>{
            if (isMatch){
            const token =_user.getSignedToken()
            res.status(201).json({
                success: true,
                token
            })
        
            } else {
            res.status(400).json({
                success: false,
                error: "Invalid Details"
            })
            return
            }
        })
    }
     catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }

  
}

////////////register

export const register = async (req, res , next)=>{
    let {firstName,
        lastName,
        password ,
        position, 
        tag, 
        dateOfBirth ,
        phoneNumber ,
        email} = req.body



        if (!tag){
            res.json({
                sucess: false,
                message: "provide your verification Tag"
      
            }) 
            return
          }
        let token = jwt.verify(tag, 'terces')
        user.findById(token.id).then(doc=>{
            if(!doc){
                res.json({
                    sucess: false,
                    message: "Invalid Tag"
            })
        }})
        .catch(err=>{
            res.status(400).json({
                success: false,
                message: err.message
            })
            return
        })

        try {
            const _user = await user.findOne({firstName, lastName, email}).select("+password")
            if (_user){
                res.status(400).json({
                    success: false,
                    message: "User exists"
                })
                return
            }
            let subscribtionInMonths = token.subscribtionInMonths
            await user.create({firstName,
                lastName,
                password ,
                role: 'Subscriber' ,
                position, 
                subscribtionInMonths, 
                dateOfBirth ,
                phoneNumber ,
                email})
                res.status(201).json({
                    success: true,
                    
                })
            } catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                })
            }
}