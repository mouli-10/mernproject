require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 8000
const hbs = require("hbs")
require("./db/conn")
const Register = require("./models/registers")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const  cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")

const static_path = path.join(__dirname , "../public")
const template_path = path.join(__dirname , "../templates/views")
const partials_path = path.join(__dirname , "../templates/partials")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine" , "hbs")
app.set("views" , template_path)
hbs.registerPartials(partials_path)



app.get("/" , (req,res) => {
    res.render("index")
})

app.get("/secret" , auth , (req,res) => {
    // console.log(`this is the awesome cookie ${req.cookies.jwt}`)
    res.render("secret")
})

app.get("/register" , (req,res) => {
    res.render("register")
})

// create new user
app.post("/register" , async(req,res) => {
    try{
        
        const password = req.body.password
        const cpassword = req.body.confirmpassword

        if(password === cpassword){
            const registerStudents = new Register({

                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword

            })
            
            console.log("the success part is " + registerStudents)

            const token = await registerStudents.createToken()

            res.cookie("jwt" , token , {
                expires: new Date(Date.now() + 60000),
                httpOnly: true
            })

            const registered = await registerStudents.save()
            res.status(201).render("index")
        }else{
            res.send("password are not matching")
        }
    }catch(error){
        res.status(400).send(error)
    }
})

app.get("/login" , (req,res) => {
    res.render("login")
})

app.post("/login" , async(req,res) => {
    try{
        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({email:email})
        const ismatch = await bcrypt.compare(password , useremail.password)

        const token = await useremail.createToken()
        console.log("the token part is " + token)

        res.cookie("jwt" , token , {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            
        })
        

        if(ismatch){
            res.status(201).render("index")
        }else{
            res.send("invalid Login details")
        }       
    }catch(error){
        res.status(400).send("invalid Login details")
    }
})




// const createToken = async() => {
//     const token =await jwt.sign({_id:"624adfed3074720328cb226f"} , "knsjbcywfydfUQHSOqksdojwihdwgtwfdtywfdgvsxgcTCSTSFT" , 
//     {expiresIn:"5 min"})
//     console.log(token)

//     const userVer = jwt.verify(token , "knsjbcywfydfUQHSOqksdojwihdwgtwfdtywfdgvsxgcTCSTSFT")
//     console.log(userVer)
// }

// createToken()







app.listen(port , () => {
    console.log(`server is running on ${port}`)
})