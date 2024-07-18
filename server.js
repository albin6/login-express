require('dotenv').config()
const express = require('express')
const session = require('express-session')
const nocache = require('nocache')

const app = express()

const userName = process.env.USER_NAME || 'albin'
const passWord = process.env.PASS_WORD || 'albin@123'

app.use(nocache())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
}))
app.use(express.static('views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', { username: req.session.user })
    }
    else if (req.session.pass) {
        req.session.pass = false
        const msg = 'Invalid Credentials!'
        res.render('login', { errMsg: msg })
    }
    else {
        const msg = ''
        res.render('login', { errMsg: msg })
    }
})

app.get('/login', (req, res) => {
    res.redirect('/')
})

app.get('/home', (req, res) => {
    res.redirect('/')
})

app.post('/signout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

app.post('/verify', (req, res) => {
    if (req.body.username === userName && req.body.password === passWord) {
        req.session.user = userName
        res.redirect('/')
    }
    else {
        req.session.pass = true
        res.redirect('/')
    }
})

app.get('*', (req, res) => {
    res.render('404')
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('server is running on port', port))