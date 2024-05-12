import mongoose ,{Schema}from "mongoose";
import {v4 as uuidv4} from "uuid"
import {LOCALBASEURL} from "../config/config.js"
let defaultImage = `${process.env.BASEURL ? process.env.BASEURL : LOCALBASEURL }/profileimages/defaultprofile.jpg`


const userschema = new Schema({

    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    profileImage:{
        type:String,
        default:defaultImage
    },
    bio:{
        type:String
    },
    phone:{
        type:Number
        // ,
        // required:true
    },
    doj:{
        type:Date,
        default:()=>new Date().toISOString()
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    userId:{
        type:String,
        default: ()=>{
            return `user${uuidv4().replace(/-/g, '')}`
        }
    },
    uploadedImages:{
        type:Array
    }

},{timestamps:true})

const User = mongoose.model("User",userschema)
export default User;

