import  {body , validationResult} from "express-validator";
import { ResponseSender } from "./responseSender.js";


// common validation for register user and login 
// isRegister variable is used to differnetiate login and register

export const RegisterValidator = async(req,res,next)=>{

    try{

    let validation = [

        body('email').exists().isEmail().normalizeEmail(),
        body('password').exists().isLength({ min: 6 }),
     
    ]
    
    if(req.body?.isRegister) validation.unshift( body('name').exists(),)

    await Promise.all(validation.map(validationRule => validationRule.run(req)));

    let errors = validationResult(req)
   
    if (!errors.isEmpty()) {
        return  ResponseSender(res,400,"failed to create user",[],errors.array())
    }

    next()
}
catch(err){
    return  ResponseSender(res,400,"failed to create user",[],err.message)
}


}

export const imagevalidate =async (req,res,next)=>{

    
    let validation = [

        body('name').exists().withMessage("Name cannot be empty"),
        body('userId').exists().withMessage("User ID cannot be empty"),
        body('imageUrl').optional()
        .notEmpty().withMessage("Image URL cannot be empty")
        .isURL({require_tld: false}).withMessage("Invalid URL")
        .trim()
       
    ];

    await Promise.all(validation.map(validationRule => validationRule.run(req)));

    let errors = validationResult(req)

    
    if (!errors.isEmpty()) {
        return  ResponseSender(res,400,"failed to uplaod image",[],errors.array())
    }

    next()


}