
import express from "express";
import mongoose from "mongoose";
import userRouter from "./router/user.router.js";
import adminRouter from "./router/admin.router.js"
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

dotenv.config({path:"./.env.dev"})

const app = express()

// other middleware

app.use(express.json())
app.use(cors())
app.use(fileUpload())
app.use(express.static('public'));

app.use(session({
    secret: process.env.USERSECRET,
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true }
  }))
// app.use(session({secret:"orange"}))
app.use(passport.initialize())
app.use(passport.session())

// server connection

const port = process.env.PORT

app.listen(port,()=>{ console.log(`port running on ${port}`)})

// data base connection

const db = process.env.DB

mongoose.connect(db).then((res)=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log("err ....",err.message)
})

// router middleware

app.use("/user",userRouter)
app.use("/admin",adminRouter)






