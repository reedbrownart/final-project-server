const Express = require('express');
const router = Express.Router();
const { UserModel } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const validateJWT = require('../middleware/validate-session');

////////////////////////////////////////////////////
// THIS IS A TEST
////////////////////////////////////////////////////

router.get('/usertest', (req, res) => {
    res.send('you have reached the user endpoint');
})

////////////////////////////////////////////////////
// REGISTER USER (POST)
////////////////////////////////////////////////////

router.post('/register', async(req, res) => {

    let { firstName, lastName, email, password } = req.body;
    try {
        let newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 13),
            isAdmin: false
        })

        const token = jwt.sign({ id: newUser.id },
            process.env.JWT_SECRET, {
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

////////////////////////////////////////////////////
// LOGIN (POST)
////////////////////////////////////////////////////

router.post('/login', async(req, res) => {
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
                const token = jwt.sign({ id: loginUser.id },
                    process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 }
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

////////////////////////////////////////////////////
// DELETE USER, REQUIRES A VALID TOKEN
////////////////////////////////////////////////////

router.delete('/delete', validateJWT, async(req, res) => {
    const userID = req.user.id;

    try {
        const USER = await UserModel.findOne({
            where: {
                id: userID
            }
        })

        const query = {
            where: {
                id: userID
            }
        };

        await UserModel.destroy(query);

        console.log('user destroyed?')

        res.status(200).json({ message: "User Removed", user: USER.email })

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

////////////////////////////////////////////////////
// THIS RETURNS A USER'S INFO, NOT SURE OF ITS APPLICATION YET!
////////////////////////////////////////////////////

router.get('/:userID', async(req, res) => {
    const { userID } = req.params;

    try {
        const USER = await UserModel.findOne({
            where: {
                id: userID
            }
        })

        res.status(200).json({ user: USER })

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

////////////////////////////////////////////////////
// MAKE ADMIN (PUT)
////////////////////////////////////////////////////

router.put('/makeadmin/:userID', async(req, res) => {
    const { userID } = req.params;

    const query = {
        where: {
            id: userID
        }
    };

    const user = await UserModel.findOne({
        where: {
            id: userID
        }
    })

    const makeAdmin = {
        isAdmin: true
    }

    try {
        const update = await UserModel.update(makeAdmin, query);
        res.status(200).json({
            user: user.email,
            message: "user is now an admin"
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

////////////////////////////////////////////////////
// REMOVE ADMIN (PUT)
////////////////////////////////////////////////////

router.put('/removeadmin/:userID', async(req, res) => {
    const { userID } = req.params;

    const query = {
        where: {
            id: userID
        }
    };

    const user = await UserModel.findOne({
        where: {
            id: userID
        }
    })

    const makeAdmin = {
        isAdmin: false
    }

    try {
        const update = await UserModel.update(makeAdmin, query);
        res.status(200).json({
            user: user.email,
            message: "user is no longer an admin"
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;