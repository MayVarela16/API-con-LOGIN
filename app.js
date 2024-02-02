const express = require('express');
const session = require('express-session');
const hashedSecret = require('./BACK/crypto.js');
const router = require('./BACK/routes.js');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);
app.use('/', router);

app.listen(PORT, () => {

    console.log(`Express escuchando en http://localhost:${PORT}`)
});