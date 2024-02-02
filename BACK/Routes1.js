const express = require('express');
const Router = express.Router();
const axios = require('axios');
const { generateToken, verifyToken } = require('./Middleware.js');
const users = require('./usersData.js');

const baseUrl = 'https://rickandmortyapi.com/api/character';


router.get('/', (req, res) => {
    if (!req.session.token) {
        const loginForm = `
        <form action='/login' method='post'>
        <label for='username'>Usuario:</label>
        <input type='text' id='username' name='username' required />
        <label for='password'>Contraseña:</label>
        <input type='password' id='password' name='password' required />
        <button type='submit'>Entrar</button>
        </form>`;
        res.send(loginForm);
    } else {
        res.send(`
        <a href='/search'>Buscar Personaje</a>
        <form action='/logout' method='post'>
        <button type='submit'>Cerrar sesión</button>
        </form>`)
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

router.get('/characters', async (req, res) => {
    try {
        const response = await axios.get(baseUrl);
        res.json(response.data.results);
    }   catch (error) {
        res.status(404).json({ message: 'sin respuesta' })
    }
});

router.post('/character/:name', async (req, res) => {
    console.log(req.params)
    const name = req.params.name;
    const url = `${baseURL}/?name=${name}`;
    try {
        const response = await axios.get(url)
        let results = response.data.results
        results.map(res => console.log(res.name))
        res.send(`
        <div class="searchInfo">
        ${results.map(result => `<p>${result.name}</p>`).join('')}        
        </div>
        `)
    } catch (error) {
        res.status(404).json({ message: 'No se encontro' })
    }
});

router.get('/search', verifyToken, (req, res) => {
    const id = req.user;
    const user = users.find(user => user.id === id);

    if (user) {
        res.send(` <h1>Bienvenido ${user.name}!!</h1>
        <a href='/'>Home</a>
        <form action='/logout' method='post'>
        <button type='submit'>Log Out</button>
        </form>
        <h3>Buscar Character</h3>
        <form action='/character/:name' method='post'>
        <label for="character">Character name:</label>
        <input type="text" id="character" placeholder="Rick">
        <button type='submit'>Search</button>
        </form>

    `);;
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;