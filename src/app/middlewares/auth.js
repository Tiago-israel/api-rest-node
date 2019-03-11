const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).send({ error: 'Acesso negado!' });
    if (!authHeader.includes('Bearer'))
        return res.status(401).send({ error: 'Token mal formatado!' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if (error)
            return res.status(401).send({ error: 'Acesso negado!' });
        req.userId = decoded.id;
        return next();
    });
}