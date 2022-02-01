import express from 'express'
import {registerUser,
     deleteUser, 
     editPassword,
     editRole, 
     editPosition, 
     getUsers,
     getOneUser,
     getUsersByPosition,
     getTag
     //generateTag
    } from '../controllers/admin.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'


const router = express.Router()

//manage user
    router.get("/users", verifyAdmin, getUsers)

    router.get("/users/:id", verifyAdmin, getOneUser)

    router.get("/users/:id", verifyAdmin, getUsersByPosition)

    router.post("/users/create", verifyAdmin, registerUser)

    router.delete("/users/:id/delete", verifyAdmin, deleteUser)

    router.patch("/users/:id/editPassword", verifyAdmin, editPassword)

    router.patch("/users/:id/editRole", verifyAdmin, editRole)

    router.get("/users/:id/editPosition", verifyAdmin, editPosition)

    router.post("/generateTag", verifyAdmin, getTag)

export default router