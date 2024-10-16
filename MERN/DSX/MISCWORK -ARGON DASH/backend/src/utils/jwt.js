import jwt from 'jsonwebtoken'

export const generateToken=async(payload)=>{
    return await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:60*60})
}