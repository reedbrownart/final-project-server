const Express = require('express');
const router = Express.Router();
const { UserModel } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');

router.get('/usertest', (req, res) => {
    res.send('you have reached the user endpoint');
})

router.post('/register', async (req, res) => {

    let { firstName, lastName, email, password } = req.body;
    try{
        let User = await UserModel.create({
            firstName,
            lastName,
            email,
            password
        })
        
        res.status(201).json({
            message: "User successfully registered",
            user: User
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            })
        } else {
            res.status(500).json({
                message: "Failed for some unknown reason"
            })
        }
    }
})

router.post('/login', (req, res) => {
    res.send('you have reached the login user endpoint');
})

router.delete('/delete/:id', (req, res) => {
    res.send('you have reached the delete user endpoint');
})

router.get('/:id', (req, res) => {
    res.send('you have reached the get user endpoint (is this really necessary?)');
})

module.exports = router;