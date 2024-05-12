import express from "express"
import * as usercontrollers from "../controllers/controller.js"

import {generatetoken,verifytoken} from "../middleware/jwt.js"
import { imagevalidate , RegisterValidator } from "../utils/expressvalidator.js"
import passport from "passport";

import "../middleware/auth.js"


const router = express.Router()

router.post("/register",RegisterValidator,usercontrollers.adduser)
router.post("/login",RegisterValidator,usercontrollers.login,generatetoken)
router.put("/updateprofile",verifytoken,usercontrollers.updateProfile)
router.put("/updatecontact",verifytoken,usercontrollers.updatePasswordContact)
router.get("/getuser",verifytoken,usercontrollers.getuser)
router.get("/getallusers",verifytoken,usercontrollers.getAllusers)
router.put("/makeaccountprivate",verifytoken,usercontrollers.makeAccountPrivate)
router.get("/logout",usercontrollers.logout)

//upload image by user 
router.post("/uploadimage",
verifytoken,
imagevalidate,
usercontrollers.uploadImageByUser)

// login with google


router.get("/googlelogin",(req,res)=>{

 
    res.send(

   `<a href="/user/auth/google" >
        <button style="background-color: blue; color: white; border: none; padding: 10px 20px; cursor: pointer;">
            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fubs.iilm.edu%2Fwp-content%2Fuploads%2F2016%2F03%2FGoogle-logo.png&f=1&nofb=1&ipt=9b78003a995ea614ae39753b57c883c58a1e81b00cebe1dc2bad1f1d817ed80b&ipo=images" alt="Google Logo" style="height: 20px; margin-right: 10px;">
            <span style="padding:5px 20px margin-bottom : 10px">Login with Google </span>
            </img>
        </button>
    </a>`
    )
})

router.get("/auth/google",(req,res)=>{
    
    passport.authenticate('google',{scope:['email','profile']})(req, res);
})

router.get("/google/callback",
 passport.authenticate('google',
   {
     successRedirect:"/user/protected",
     failureRedirect:"/user/failure"
   }
  
)
)

router.get("/protected",(req,res,next)=>{
    if(req.user)  next()
    else return res.send(401)
},(req,res)=>{
    res.send("Protected resource")
})

router.get("/failure",(req,res)=>{
    res.send("failed route")
})

export default router;