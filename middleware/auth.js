import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// wants to like a post
//click the like button => auth middleware (next) => like controler....

const auth = async(req, res, next) => {
    console.log("Middleware")

    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = !token.substring(0,4) === "ya29";

        let decodedData;


        if(token && isCustomAuth){
            decodedData = jwt.verify(token,'test');

            req.userId = decodedData?.id;
        }
        else{
            decodedData = jwt.decode(token);
            console.log(decodedData);
            
            req.userId = decodedData?.sub;
        }

        console.log(`THE USER ID IS ${req.userId}`)

        next();
    }
    catch (error){
        console.log(error);
    }
}

export default auth;