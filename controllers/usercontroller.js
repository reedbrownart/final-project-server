const Express = require('express');
const router = Express.Router();

router.get('/usertest', (req, res) => {
    res.send('you have reached the user endpoint');
})

router.post('/register', (req, res) => {
    res.send('you have reached the register user endpoint');
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