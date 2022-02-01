import {User as user} from "../models/User.js"
import Tag from '../models/Tags.js'
import jwt from 'jsonwebtoken'


//manage user data////////////////////////////////////////////////////////////////////


    //get all users
export const getUsers = async (req, res, next)=>{
    try{
            await user.find({}, (err, doc)=>{
                if (err) {
                    res.status(400).json({
                        success: false,
                        error: err.message})
                        return
                } else {
                    res.status(201).json({
                        success: true,
                        doc
                    })
                    return
                }
            }).clone()
        } catch (error){
            res.status(400).json({
                success: false,
                error: error.message
            })        }
    } 
    //get one user
export const getOneUser = async (req, res, next)=>{
    try{
        await user.findById(req.params.id, (err, doc)=>{
        if (err) {
            res.status(400).json({
                success: false,
                error: err.message})
                return
        } else {
            res.status(201).json({
                success: true,
                doc
            })
        
        }
    }).clone()
} catch (error){
    res.status(400).json({
        success: false,
        error: error.message
    })}
}

    //get one user by position
    export const getUsersByPosition = async (req, res, next)=>{
        try{
            await user.find(req.body.position, (err, doc)=>{
            if (err) {
                res.status(400).json({
                    success: false,
                    error: err.message})
                    return
            } else {
                res.status(201).json({
                    success: true,
                    doc
                })
            
            }
        }).clone()
    } catch (error){
        res.status(400).json({
            success: false,
            error: error.message
        })}
    }

    //register user
export const registerUser = async (req, res, next) =>{
    let {firstName,
    lastName,
    password ,
    role ,
    position, 
    subscribtionInMonths, 
    dateOfBirth ,
    phoneNumber ,
    email} = req.body
    try {
        const _user = await user.findOne({firstName, lastName, email}).select("+password")
        if (_user){
            res.status(400).json({
                success: false,
                message: "User exists"
            })
            return
        }
        
        await user.create({firstName,
            lastName,
            password ,
            role ,
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
    //DELETE USER
export const deleteUser = async (req, res, next)=>{
    user.findByIdAndDelete(req.params.id, (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
        else{
            res.status(200).json({
                success: true,            })
        }
    })

} 
    //EDIT PASSWORD
export const editPassword = (req, res, next)=>{
    let pass = req.body.password
    if(pass.length < 6){
        return res.status(400).json({
                success: false,
                error: "password length must be more than 6"
        })
    }
    user.findById(req.params.id).select('+password').exec( (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: err.message
            })
            return
        }
        else{
            doc.password = req.body.password
            doc.save()
                .catch(error =>{
                    res.status(400).json({
                        success: false,
                        error: error.message
                    })
                    return

                    })
                .then(
                    res.status(200).json({
                        success: true,
                        doc
                    })
                ) 
        }
    })
}

    //EDIT position
export const editPosition = (req, res, next)=>{
        user.findOneAndUpdate({_id: req.params.id}, {position: req.body.position} ,{new: true}, (err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
            }
            else{
                res.status(200).json({
                    success: true,
                    doc
                } )
            }
        })
    }
  //EDIT ROLE
  export const editRole = (req, res, next)=>{
    user.findOneAndUpdate({_id: req.params.id}, {role: req.body.role} ,{new: true}, (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
        else{
            res.status(200).json({
                success: true,
                doc
            } )
        }
    })
}


//generate Tag
export const getTag = (req, res) => {
    let _token = jwt.sign({id: req.user._id, subscribtionInMonths: req.body.subscribtionInMonths}, 'terces', {expiresIn: process.env.JWT_TIMEOUT} )
    Tag.create({_token}).then(doc=>{
        res.status(200).json({
            success: true,
            doc})
    }).catch(err=>{
        res.status(400).json({
            success: false,
            error: error.message
        })
        return
    })
}
