const Express = require('express');
const router = Express.Router();
const { UserModel } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UniqueConstraintError } = require('sequelize/lib/errors');
// const validateJWT = require('../middleware/validate-session');

router.get('/usertest', (req, res) => {
    res.send('you have reached the user endpoint');
})

router.post('/register', async (req, res) => {

    let { firstName, lastName, email, password } = req.body;
    try{
        let newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 13)
        })

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            {
                expiresIn: 60 * 60 * 24
            }
        )
        
        res.status(201).json({
            message: "User successfully registered",
            user: newUser,
            token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            })
        } else {
            res.status(500).json({
                message: "Failed for some unknown reason",
                err
            })
        }
    }
})

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        let loginUser = await UserModel.findOne({
            where: {
                email
            }
        })
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password); //need to add bcrypt

            if (passwordComparison) {
                const token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 24 }
                )

                res.status(200).json({
                    message: "User successfully logged in!",
                    user: loginUser,
                    token
                })
            } else {
                res.status(401).json({
                    message: "Error: password."
                })
            }
        } else {
            res.status(401).json({
                message: "Error: username."
            })
        }
    } catch (err) {
        res.status(500).json({
            error: `Failed to login user. ${err}`
        })
    }
})

router.delete('/delete/:id', (req, res) => {
    res.send('you have reached the delete user endpoint');
})

router.get('/:id', (req, res) => {
    res.send('you have reached the get user endpoint (is this really necessary?)');
})

module.exports = router;