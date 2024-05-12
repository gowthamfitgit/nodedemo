import fs from "fs"
import Randomstring from "randomstring";


export const upload = async(req,res,isProfile)=>{
    try{

    let directory = isProfile ? "./public/profileimages" : "./public/images"

    await fs.promises.mkdir(directory, { recursive: true }); 

    let imagename = Date.now() + Randomstring.generate(5) + ".png"

    await req.files.file.mv(directory + "/"+ imagename)

    return `${process.env.BASEURL}/profileimages/${imagename}`

    }
    catch(err){
        
        return false
    }
}