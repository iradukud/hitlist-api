const express = require('express')
const router = express.Router()
const { postSignup, postLogin } = require('../controllers/auth')


//Routes that deal with logining in
router.post('/signup', postSignup)
router.post('/signin', postLogin)


module.exports = router