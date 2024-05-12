import mongoose ,{STATES, Schema}from "mongoose";
import {v4 as uuidv4} from "uuid"
let defaultImage = `${process.env.BASEURL}/profileimages/defaultprofile.jpg`

const adminschema = new Schema({

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
    adminID:{
        type:String,
        default: ()=>{
            return `admin${uuidv4().replace(/-/g, '')}`
        }
    }
   
},{timestamps:true})

const Admin = mongoose.model("Admin",adminschema)
export default Admin;

