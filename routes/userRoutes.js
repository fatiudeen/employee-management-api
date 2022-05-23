import express from 'express'
import { getUser,
        editName, 
        changePassword, 
        newProfileImg, 
        deleteProfileImg,
        editDOB,
        editSkill,
        getAvi,
        editAddress 
            } from '../controllers/user.js'

import verify from '../middlewares/verify.js'
import {uploadAvi} from '../middlewares/upload.js' 

const router = express.Router()

//manage user data 
router.get("/user", getUser)

router.post("/user/avi", verify, uploadAvi.single('avi'), newProfileImg)

router.delete("/user/avi", verify, deleteProfileImg)

router.get("/user/avi", getAvi)

router.patch("/user/name", verify, editName)

router.patch("/user/address", verify, editAddress)

router.patch("/user/role", verify, editSkill)

router.patch("/user/DOB", verify, editDOB)

router.patch("/user/password", verify, changePassword)


export default router