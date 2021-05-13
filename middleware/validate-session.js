const jwt = require("jsonwebtoken");
const {UserModel} = require("../models");

const validateJWT = async (req, res, next) => {
    if (req.method === "OPTIONS"){
        console.log("From validation.js", req)
        return next();
    } else if (req.headers.authorization) {
        const{authorization} = req.headers;
        const payload = authorization ? jwt.verify(authorization, process.env.JWT_SECRET) : undefined

        if (payload) {
            let foundUser = await UserModel.findOne({
                where: {
                    id: payload.id
                }
            })

            if (foundUser) {
                req.user = foundUser;
                next()
            } else {
                res.status(400).send({message: "Not authorized", messageOrigin: "validate-session.js"})
            }
        } else {
            res.status(401).send({message: "Invalid token!", messageOrigin: "validate-session.js"})
        }
    } else {
        res.status(403).send({message: "Forbidden"})
    }
    
}

module.exports = validateJWT;
