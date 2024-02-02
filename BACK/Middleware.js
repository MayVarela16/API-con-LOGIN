const jwt = require('jsonwebtoken');
const hashedSecret = require('./crypto.js');

function generateToken(user){
    return jwt.sign({users: user.id}, hashedSecret, {expiresIn: '1h'});
}

function verifyToken(req, res, next) {
    const token = req.session.token;
    if(!token){
        return res.status(401).json({mensaje: 'No existe el token'});
    }
    else {
        jwt.verify(token, hashedSecret, (err, decoded) =>{
            if(err){
                return res.status(401).json({mensaje: 'Token invalido'});
            }
            req.user = decoded.user;
            next();
        })
    }   
}

module.exports = {
    generateToken,
    verifyToken
}