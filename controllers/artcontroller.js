const Express = require('express');
const router = Express.Router();

router.get('/arttest', (req, res) => {
    res.send('you have reached the art endpoint');
})

router.post('/create', (req, res) => {
    res.send('you have reached the create art endpoint');
})

router.put('/update/:id', (req, res) => {
    res.send('you have reached the update art endpoint');
})

router.delete('/delete/:id', (req, res) => {
    res.send('you have reached the delete art endpoint');
})

router.get('/:id', (req, res) => {
    res.send('you have reached the get art by id endpoint');
})

router.get('/', (req, res) => {
    res.send('you have reached the get 10 most recent art endpoint');
})

module.exports = router;