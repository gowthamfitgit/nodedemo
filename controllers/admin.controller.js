import bcrypt from "bcrypt"
import {ResponseSender} from "../utils/responseSender.js"
import {upload} from "../utils/imageUploader.js"

// admin 

import Admin from "../models/admin.js"

// Creating Admin / sub admins
export const addAdmin = async(req,res)=>{
    try{
    

     var data = req.body

     // encrypt password

     var hasedpassword = await bcrypt.hash(data.password,5)
     req.body.password = hasedpassword

     // save profile image
    if(req?.files?.file){
        let imageurl= await upload(req,res,true) // true for profile image
        if (imageurl) req.body.profileImage = imageurl
        else ResponseSender(res,200,"could not store profile image",[],err.message)
    }
 
    // save Admin details with pwd and profileimage to db
    var newadmin = new Admin(req.body)
    var resp = await newadmin.save()

     if(resp) ResponseSender(res,200,"Admin created")

     
    }
    catch(err){

        ResponseSender(res,400,"Could not create Admin",err.message,err.message)
    }
}

//adminLogin

export const adminLogin = async(req,res,next)=>{
    try{

        var user = await Admin.find({email:req.body.email,name:req.body.name})
        console.log("user foun",user)

        var password = await bcrypt.compare(req.body.password,user[0].password)

        // generating jwt token
        if(password){

         req.body.id = user[0].adminID
         delete req.body.password      // for safety purpose remove password when generating jwt token
         req.body.user = "Admin"
         next()
        }
       
    }
    catch(err){
        ResponseSender(res,400,err.message,[],err.message)
    }
}