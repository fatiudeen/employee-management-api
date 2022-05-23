import {User as user} from "../models/User.js"
import bcrypt from "bcryptjs"
import Tag from '../models/Tags.js'

export const login = async (req, res, next) =>{
  const {login, password} = req.body


  if (!login || !password){
    res.json({
        sucess: false,
        message: "provide a username and a password"

    }) 
    return
}
      let _user = await user.findOne()
        .or([{email: login}, {phoneNumber: login}])
        .select("+password")

    
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
        tag,
        dateOfBirth ,
        phoneNumber ,
        email} = req.body

    let token


        if (!tag){
            res.json({
                sucess: false,
                message: "provide your verification Tag"
      
            }) 
            return
          }

        await Tag.findOne({tag: tag}).then(doc=>{
            if(!doc){
                res.json({
                    sucess: false,
                    message: "provide a valid verification Tag"
          
                }) 
                return
            }
            token = doc
        
        //verifies the subscribers tag
        user.findById(doc.token).then(_docu=>{
            if(!_docu){
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
        }).catch(error=>{
            res.status(400).json({
                success: false,
                message: error.messager
            })
            return
        })
        

       // try {
            //checks if a user exists
            const _user = await user.findOne({firstName, lastName, email}).select("+password")
            .catch(error=>{
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            })
            if (_user){
                res.status(400).json({
                    success: false,
                    message: "User exists"
                })
                return
            }

            //creates new subscriber
            let duration = token.duration
            let plan = token.plan 
            await user.create({firstName,
                lastName,
                password ,
                role: 'Subscriber', 
                duration, 
                dateOfBirth ,
                phoneNumber ,
                plan,
                email}).then(doc=>{

                    //removes tag after user registration
                    Tag.findOneAndDelete({tag: tag}).catch(err=>{
                        res.status(400).json({
                            success: false,
                            error: err.message
                    })
                    return})
                    res.status(201).json({
                        success: true,
                        doc: doc
                        
                    })
                }).catch(error=>{
                    res.status(400).json({
                        success: false,
                        error: error.message
                    })
                    return
                })


                
            /*} catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }*/
}