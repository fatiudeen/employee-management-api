import {User as user} from "../models/User.js"
import Tag from '../models/Tags.js'


//manage user data////////////////////////////////


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
    export const getUsersByRoles = async (req, res, next)=>{
        try{
            await user.find(req.body.role, (err, doc)=>{
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
    skill, 
    duration, 
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
            skill, 
            duration, 
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
    await user.findByIdAndDelete(req.params.id, (err, doc)=>{
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
export const editPassword = async (req, res, next)=>{
    let pass = req.body.password
    if(pass.length < 6){
        return res.status(400).json({
                success: false,
                error: "password length must be more than 6"
        })
    }
    await user.findById(req.params.id).select('+password').exec( (err, doc)=>{
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

    //EDIT role
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
  //EDIT ROLE
  export const editSkill = (req, res, next)=>{
    user.findOneAndUpdate({_id: req.params.id}, {skill: req.body.skill} ,{new: true}, (err, doc)=>{
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

    let rand = Math.floor(Math.random() * 90000) + 10000
    // let _token = jwt.sign({id: req.user._id, duration: req.body.duration}, process.env.JWT_SECRET, {} )
    
    Tag.create({duration: req.body.duration, tag: rand, plan: req.body.plan, token: req.user._id}).then(doc=>{
        res.status(200).json({
            success: true,
            doc: doc.tag})
    }).catch(err=>{
        res.status(400).json({
            success: false,
            error: error.message
        })
        return
    })
}
/////////////// make an existing user admin
export const upgradeUser = (req,res,next) =>{

    user.findOneAndUpdate({_id: req.params.id}, {isAmin: true} ,{new: true}, (err, doc)=>{
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

export const findPending = (req,res,next) =>{

    user.find().and({role: 'Subscriber'}, {'wifiLogin.status': 'Pending'} ,(err, doc)=>{
        if (err){
            res.status(500).json({
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

export const activateWifi = (req,res,next) =>{

    user.findOneAndUpdate({_id: req.params.id}, {'wifiLogin.status': 'Active'} ,{new: true}, (err, doc)=>{
        if (err){
            res.status(500).json({
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