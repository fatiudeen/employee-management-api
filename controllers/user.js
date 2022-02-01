import bcrypt from "bcryptjs"
import fs from 'fs'
//
import {User as user} from "../models/User.js"
import{cloudDownload, cloudUpload, cloudDelete} from '../middlewares/upload.js'

//MANAGE USER DATA
    // get user profile 
    export const getUser = async (req, res, next)=>{
        try{
            await user.findOne({_id: req.user._id})
            .populate({path: 'department', seleect: 'name abbr'})
            .exec( (err, doc)=>{
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
        })
    } catch (error){
        res.status(400).json({
            success: false,
            error: error.message
        })}
    }
    //ADD FULL NAME
    export const editName = (req, res, next)=>{
        user.findOneAndUpdate({_id: req.user._id}, {fristName: req.body.firstName, lastName: req.body.lastName} ,(err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }
            else{
                res.status(200).json({
                    success: true,
                } )
            }
        })
    }
    //ADD role
    export const editRole = (req, res, next)=>{
        user.findOneAndUpdate({_id: req.user._id}, {rank: req.body.position} ,(err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }
            else{
                res.status(200).json({
                    success: true,
                    
                } )
            }
        })
    }

    //ADD DOB
    export const editDOB = (req, res, next)=>{
        user.findOneAndUpdate({_id: req.user._id}, {DOB: req.body.DOB} ,(err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }
            else{
                res.status(200).json({
                    success: true,
                    
                } )
            }
        })
    }
    //CHANGE PASSWORD
    export const changePassword = (req, res, next)=>{
        let pass = req.body.oldPassword
        let newPass = req.body.newPassword

        if(newPass.length < 6 ){
            return res.status(400).json({
                    success: false,
                    error: "password length must be more than 6"
            })
        }
           
        user.findById(req.user._id).select("+password").exec( (err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: err.message
                })
                return
            }
        
            if (req.body.newPassword != req.body.confirmPassword){
                    res.status(401).json({
                    success: false,
                    error: "confirm the new password"
                })
                return
                }
            let old = doc.password
            var match = bcrypt.compareSync(pass, old)
            if(!match){
                res.status(401).json({
                success: false,
                error: "incorrect old password"
                })
                return
            }

            doc.password = req.body.newPassword
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
                 
            })
        }
    
    

//SUPPORT////request without jwt/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//// upload avi
export const newProfileImg = async (req, res, next) => {

    let result
    await cloudUpload(req.file)
    .then(doc=>{
        result= doc
    })
    .catch(err=>{
        res.status(400).json({
            success: false,
            error: err.message})
            return
    })

    fs.unlink(req.user.avi, (err, data) => {
        if (err) {
            return res.status(404).json({ error: err.message })
        }
    })
    user.findOneAndUpdate({_id: req.user._id}, {avi: result.key}, (err, doc)=>{
        if (err){
            res.status(500).json({
                success: false,
                error: err.message
            })
            return
        }
        else{
            res.status(200).json({
                success: true
                
             })
        }
    })
}

////get avi
export const getAvi = (req, res)=>{
    const readStream = cloudDownload(req.user.avi)
    readStream.pip(res).catch(err=>{
        res.status(400).json({
            success: false,
            error: err.message})
            return
    })

}

 //// remove avi
 export const deleteProfileImg = async (req, res, next) => {
   await cloudDelete(req.user.avi, (err, data) => {
        if (err) {
            return res.status(404).json({ error: err.message });
        }
            user.findOneAndUpdate({_id: req.user._id}, {avi: ''} ,(err, doc)=>{
                if (err){
                    res.status(500).json({
                        success: false,
                        error: err.message
                    })
                    return
                }else{
                    res.status(200).json({
                        success: true,
                    })
                }
            })
            
        })
        
    }

