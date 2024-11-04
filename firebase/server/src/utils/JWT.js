const jwt =require('jsonwebtoken')

 const genToken=async(payload)=>{

    return await jwt.sign(payload,'sdsdsdsd',{expiresIn:'1h'})
}

module.exports=genToken