const res = require("express/lib/response")
const jwt = require("jsonwebtoken")
const Register = require("../modles/registers")

const auth = async(req , res , next) => {
    try{

        const token = re.cookies.jwt
        const verifyUser = jwt.verify(token , process.env.SECRET_KEY)
        console.log(verifyUser)

    }catch(error){
        res.status(401).send(error)
    }
}

module.exports = auth