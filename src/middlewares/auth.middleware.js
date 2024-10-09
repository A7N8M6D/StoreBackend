import jwt from "jsonwebtoken"
const authMiddleware=async(req,res,next)=>{
const token =req.cookies?.AccessToken;
console.log(`Token ${token}`)
if(!token)
{
 return res.status(400).json({error:"Token is required"})
}
try
{
const tokenVerified= await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
if(!tokenVerified)
{
    return res.status(400).json({error:"Unathorized User Request"})  
}
req.user=tokenVerified;
next()
}
catch(error)
{
    return res.status(400).json({error:"Error while Verify the token"})  
}
}

export {authMiddleware}