

// common function to send response 

export const ResponseSender = async(res, statuscode , message , data = [],err=[])=>{


    const responseJson = {

        message:message,
        data:data,
        err:err

    }

    return res.status(statuscode).json(responseJson)

}