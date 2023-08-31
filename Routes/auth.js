const express = require("express")
const router = express.Router()
const UserModel  = require("../Models/Users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cookieParser = require("cookie-parser")


router.use(cookieParser())

const salt  = bcrypt.genSaltSync(10);



router.post("/signup", async (req,res)=>{
    const {username,email,password} = req.body
    const Userexists = await UserModel.findOne({email})

    if(Userexists) {
        return res.status(400).json({ error: "User with this email already exists" });

    }

    try  {

    const hashedPassword = bcrypt.hashSync(password, salt);

    const userDoc = await UserModel.create({
        username,
        email,
        password : hashedPassword
    })

    res.json(userDoc)
     } catch(e) {
        res.status(400).json({error:"Signup Failed"})
     }

})

router.post("/login", async(req, res)=>{
    const {email, password} = req.body
    const UserDoc = await UserModel.findOne({email})
    if(!UserDoc){
        return res.status(404).json({error:"User doesn't exists"})
    }

    const Passok =  bcrypt.compareSync(password,UserDoc.password)

    if(Passok){
        jwt.sign({email,id:UserDoc.id},process.env.jwt_secret, {}, (err,token)=>{
            if (err) throw err;
            res.cookie("token", token).json("Login ok")

        })

    }else {
        res.status(400).json({error : "Wrong Credentials"})
    }
})


router.get("/profile", (req,res)=>{
    try {
    const {token} = req.cookies
    if(!token) {
        return res.status(401).json({error : "User is not Logged in"})
    }

    jwt.verify(token,process.env.jwt_secret, {}, (err,info) => {
        if (err) throw err
        res.json(info)
    })
} catch(error) {
    res.json(400).json({error: "user is not logged in"})
    return
}
    
})


router.post("/logout", (req,res) => {
    const {token} = req.cookies
    if(!token) {
       return res.status(401).json({error : "You are not Logged in"})
    }

    res.cookie("token","").json("logout successful")
})

module.exports = router