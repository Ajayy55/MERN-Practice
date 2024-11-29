const memberSession =(req,res)=>{
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const browser= req.headers['user-agent'];
    const normalizedIP = ip === "::1" ? "127.0.0.1" : ip;
    console.log("User IP Address:", normalizedIP,'\n',browser);
res.send(normalizedIP)

}


export {memberSession}