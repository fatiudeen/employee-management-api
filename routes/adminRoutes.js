import express from 'express'
import {registerUser,
     deleteUser, 
     editPassword,
     editRole, 
     editSkill, 
     getUsers,
     getOneUser,
     getUsersByRoles,
     getTag,
     upgradeUser,
     findPending,
     activateWifi
    } from '../controllers/admin.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'


const router = express.Router()

//manage user
    router.get("/users", verifyAdmin, getUsers)

    router.get("/users/:id", verifyAdmin, getOneUser)

    router.get("/users/:id", verifyAdmin, getUsersByRoles)

    router.post("/users/create", verifyAdmin, registerUser)

    router.delete("/users/:id/delete", verifyAdmin, deleteUser)

    router.patch("/users/:id/editPassword", verifyAdmin, editPassword)

    router.patch("/users/:id/editRole", verifyAdmin, editRole)

    router.patch("/users/:id/upgradeUser", verifyAdmin, upgradeUser)

    router.get("/users/:id/editPosition", verifyAdmin, editSkill)

    router.get("/users/findPending", verifyAdmin, findPending)

    router.get("/users/:id/activateWifi", verifyAdmin, activateWifi)

    router.post("/generateTag", verifyAdmin, getTag)



export default router