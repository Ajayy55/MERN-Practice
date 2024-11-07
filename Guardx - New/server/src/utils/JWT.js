import jwt from 'jsonwebtoken';

export const GenJwtToken=async(payload)=>{

    return await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
}