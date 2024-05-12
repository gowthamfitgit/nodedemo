import jwt from "jsonwebtoken";
import { ResponseSender } from "../utils/responseSender.js";


export const generatetoken = async(req,res)=>{
    try{

        console.log("req.body",req.body)
        let data = req.body

        let encdata = {

            name:data.name,
            id:data.id,
            user:data.user
        }

        let token =  jwt.sign(

            encdata,

            req.body.user === "Admin" ? 
            process.env.ADMINSECRET :
            process.env.USERSECRET
        ) 

        ResponseSender(res,200,"logged in successfully",`Bearer ${token}`)

        // note :: This implemetnation is for local Storage

        // in case of using cookies
        // 1) npm i cookie-parser
        // 2) app.use(cookieParser());
        // 3) res.cookie("Beareroken",`Bearer ${token}`)
       
    }
    catch(err){
        ResponseSender(res,400,"Login Failed",[],err.message)
    }
} 

export const verifytoken = async(req,res,next)=>{
    try{

        if(!req.headers.authorization) return ResponseSender(res,401,"Unauthorized Access")

         // verification
        var token = req.headers.authorization.split(" ")[1]
     
        var user = await jwt.verify(token,req.body?.userId ?process.env.USERSECRET:process.env.ADMINSECRET)
       
        if(user) {
            req.body.user = user.user  // user Admin || User
            next()
        }
        else return  ResponseSender(res,401,"Unauthorized Access")
        

    }
    catch(err){
     
        ResponseSender(res,401,"Unauthorized Access",[],err.message)
    }
}