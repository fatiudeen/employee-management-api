import express from 'express'
import {login, register} from '../controllers/login.js'

const router = express.Router()

router.post("/login", login)

router.post('/subscriber/reg', register)


export default router