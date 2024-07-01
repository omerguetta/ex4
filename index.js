require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { userRouter } = require("./routers/usersRouter");
const {preferenceRouter} = require("./routers/preferencesRouter");

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
    res.set('Content-Type', 'application/json');
    next();
});

app.use('/api/users', userRouter);
app.use('/api/preferences', preferenceRouter);

app.use((req,res) => {
    res.status(404).json({error: 'Resource not found'});
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});