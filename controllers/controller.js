import bcrypt from "bcrypt"
import {ResponseSender} from "../utils/responseSender.js"
import {upload} from "../utils/imageUploader.js"
import passport from "passport"



//models

import User from "../models/user.js"

//user registration

export const adduser = async(req,res)=>{
    try{
    
     
     var data = req.body

     // encrypt password

     var hasedpassword = await bcrypt.hash(data.password,5)
     req.body.password = hasedpassword

    
     // save profile image
    if(req?.files?.file){
        let imageurl= await upload(req,res,true) // true for profile image
        if (imageurl) req.body.profileImage = imageurl
        else ResponseSender(res,200,"could not store profile image")
    }
 
    // dave user details with pwd and profileimage to db
    var user = new User(req.body)
    var resp = await user.save()


     if(resp) ResponseSender(res,200,"user created")
     
    }
    catch(err){

        ResponseSender(res,400,"Could not create user",err.message,err.message)
    }
}


// user login and jwt token generation
export const login = async(req,res,next)=>{
    try{

        var user = await User.find({email:req.body.email,name:req.body.name})
      
        var password = await bcrypt.compare(req.body.password,user[0].password)

        // generating jwt token
        if(password){

         req.body.id = user[0].userId
         delete req.body.password      // for safety purpose remove password when generating jwt token
         req.body.user = "User"
         next()
        }
       
    }
    catch(err){
        ResponseSender(res,400,err.message,[],err.message)
    }
}

// updating image , name , bio
export const updateProfile = async(req,res)=>{

    // name , profile , image updation

    try{
              
        let data = req.body  
        let user = await User.findById(data._id)


        if(user){
        let updateData = {
            name:data?.name ? data.name : user.name,
            bio:data?.bio ? data.bio : user.bio
           
        }

        
        if(req.files?.file){
            let imageurl = await upload(req,res,true)
            updateData.profileImage = imageurl
        }

        let upduser = await User.findOneAndUpdate({_id:data._id , userId:data.userId },
                                            {$set:updateData} )

        if(upduser) ResponseSender(res,200,"Profile Updated")


        }

    }
    catch(err){
        ResponseSender(res,400,"Profile Updation failed",[],err.message)
    }
}


// update credentials like password and email , phone
export const updatePasswordContact = async(req,res)=>{

    // email , password , phone -- updated separately if other security measures have to be implemented in future

    try{
              
        let data = req.body  
        let user = await User.find({_id:data._id,userId:data.userId})
        user = user[0]

        if(user){
            let isCorrect = await bcrypt.compare(data.password,user.password)

            if(isCorrect){
                let updateData = {
                    email:data?.email ? data.email : user.email,
                    phone:data?.phone ? data.phone: user.phone
                   
                }
          
                if(data?.newpassword)  updateData[password] = await bcrypt.hash(data.newpassword,5)

                let upduser = await User.findOneAndUpdate({_id:data._id , userId:data.userId },
                    {$set:updateData} )

                if(upduser) ResponseSender(res,200,"Profile Updated")
            }
        }
    }
    catch(err){
        ResponseSender(res,400,"Profile Updation failed",[],err.message)
    }
}

// get user based on private or protected 
// NOTE :: give access using the "isAdmin" to identify whether it is admin or normal user requesting
// also validate using "isPrivate" to restrict accesss to private account

export const getuser = async(req,res)=>{
    try{
      
       var user = await User.find({userId:req.body.userId})
       

       if(user.length) {

       let isAdmin = req.body?.user
       let userData = user[0]

       if(isAdmin === "Admin" || (isAdmin !== "Admin" && userData.isPrivate == false))
          ResponseSender(res,200,"user details",user[0])
       else ResponseSender(res,400,"This Account is private")

        
       }

       else ResponseSender(res,404,"user not found")

    }
    catch(err){
        ResponseSender(res,404,"user not found",[],err.message)
    }
}


// make account private or public

export const makeAccountPrivate = async(req,res)=>{
    try{
        // to make account private or public send isPrivate value as true or false in body
        console.log("data",req.body)

        let user = await User.findOneAndUpdate({userId:req.body.userId},
                                               {$set:{isPrivate:req.body.isPrivate}},{new:true})

        console.log("userdata",user)

        if(user) ResponseSender(res,200,"Account is private now")
        else ResponseSender(res,404,"User Not Found")
    }
    catch(err){
        console.log(err.message)
        ResponseSender(res,400,"failed to make account private",[],err.message)
    }
}


// get users based on "isAdmin" and "isPrivate"

export const getAllusers = async(req,res)=>{
   try{

    // user value obtained from jwt token verification

    let findQuery = req.body?.user === "Admin" ? {} : {isPrivate:false}
    let users = await User.find(findQuery)

    ResponseSender(res,200,"users List",users)
   }
   catch(err){
     ResponseSender(res,400,"failed to get users",[],err.message)
   }
}

// logout
// clear localstorage session cookies and other user related datas if any.

export const logout = async(req,res)=>{
    try{
       

        req.logout((err)=>{
            if(err) console.log("loguterror",err.message)
            req.session.destroy();
            res.clearCookie("connect.sid");
            res.send("goodbye");

        });
       
        // clear all credentials 

        // if token stored in local storage remove it in frontend using 
        // localstorage.removeitem("bearer")

        // in case of cookie res.clearcookie("bearer")
    }
    catch(err){
        console.log(err.message)
        ResponseSender(res,400,"failed to logout",[],err.message)
    }
}

// image uploading by user (not profile image ) 

export const uploadImageByUser = async(req,res)=>{
    try{

        // Note :: Allowing users to directly upload urls should be prohibited as it might cause security risks,
        // if it is unavoidable the url 
        // data should be checked and sanitized



        // uplaoding images if file exists

        let imageurl  = ""

        if(req.files?.file){
             
            imageurl = await upload(req,res,false)
            console.log("imageurl test",imageurl)

        }
            
        if(imageurl || req.body?.imageUrl){

                 console.log("url test.....",imageurl , req.body?.imageUrl)
                let user = await User.findOneAndUpdate({userId:req.body.userId},
                {
                    $push:
                    {uploadedImages: req.body?.imageUrl ? req.body?.imageUrl : imageurl}
                })

                if(user) ResponseSender(res,200,"Successfully uplaoded")
        }
        else  ResponseSender(res,400,"failed to uplaod image")
        
    }
    catch(err){
          console.log(err.message)
          ResponseSender(res,400,"failed to uplaod image",[],err.message)
    }
}