dotenv.config()
import dotenv from 'dotenv'
import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import methodOverride from 'method-override'

import loginRoutes from './routes/loginRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

//middlewares
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(methodOverride('_method'))

//Routes
app.use("/auth", loginRoutes)
app.use("/admin", adminRoutes)
app.use("/api", userRoutes)
app.use('*',(req,res)=>{
  res.status(500).send({
      status:false, message:'Sorry Route does not exists',
  })
})

// Database configuration
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err))


const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
