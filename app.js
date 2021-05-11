const Express = require('express');
const app = Express();

const controllers = require('./controllers');
app.use("/user", controllers.userController);
app.use('/art', controllers.artController);

app.use('/test', (req, res) => {
    res.send('This is a test endpoint');
})

app.listen(3000, () => {
    console.log(`[Server]: App is listening on 3000`);
});