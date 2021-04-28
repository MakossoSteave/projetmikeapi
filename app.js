

const cors = require('cors'),
    express = require('express'),
    jwt = require('jsonwebtoken');

const app = express() 

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE'); 
    next()
})

const database = [
    { email: 'steave1@live.fr', password: 'steave', id: 1, fullname: 'Makosso' },
    { email: 'tsteave2@live.fr', password: 'steave2', id: 2, fullname: 'makosso2' },
]

app.use(express.urlencoded({ extended: false }))

const checkEmailAndPassword = (req, res, next) => {
    try {
        const { email, password } = req.body

        const regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email === undefined || !regex.test(email.trim()))
            return res.status(401).json({ error: true, message: 'Error email' })
        else if (password === undefined || password.lenght < 4)
            return res.status(401).json({ error: true, message: 'Error password' })
        else
            next()

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error server' })
    }
}
const checkToken = (req, res, next) => {
    try {

        if (!req.headers.authorization) {
            return res.status(403).json({ error: 'No credentials sent!' });
        }
        console.log(req.headers.authorization);
        console.log(jwt.verify(req.headers.authorization.split(' ')[1], 'keyprive'));
        next()

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error server', err: err })
    }
}


app.post('/login', checkEmailAndPassword, (req, res) => {
    const { email, password } = req.body
    database.forEach((user) => {
        if (user.email === email && user.password === password) {
            delete user.password
            user.token = jwt.sign({ id: user.id }, 'keyprive');
            delete user.id
            return res.status(200).json(user)
        }
    })
    return res.status(401).json({ error: true, message: 'Error email/password' })
})

app.get('/profile', checkToken, (req, res) => {
    return res.status(401).json({ error: true, message: 'Token' })
})


app.listen(5050)