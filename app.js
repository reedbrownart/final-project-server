require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');

app.use(Express.json());

app.use(require('./middleware/headers'));

const controllers = require('./controllers');
app.use("/user", controllers.userController);
app.use('/art', controllers.artController);
app.use('/reviews', controllers.reviewController);

app.use('/test', (req, res) => {
    res.send('This is a test endpoint');
})

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error: ${err}`);
    })