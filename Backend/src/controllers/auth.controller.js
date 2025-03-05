export const signup = (req,res,next)=>{
    console.log("Listening the signup getRequest....");
    res.status(200).json({
        message : "you get the signup credential"
    })
}

export const login = (req,res,next)=>{
    console.log("Listening the login getRequest....");
    res.status(200).json({
        message : "you get the login credential"
    })
}
export const logout = (req,res,next)=>{
    console.log("Listening the logout getRequest....");
    res.status(200).json({
        message : "you get the logout credential"
    })
}

