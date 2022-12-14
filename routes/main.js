const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest, homeController.getIndex)

router.get('/login', ensureGuest, authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/logout', authController.logout)

router.get('/register', ensureGuest, authController.getRegister)

router.post('/register', authController.postRegister)

router.get('/dashboard', ensureAuth, authController.getDashboard)

router.get('/profile/edit/:id', ensureAuth, authController.getEditProfile)

router.put('/:id', ensureAuth, authController.updateProfile)



module.exports = router