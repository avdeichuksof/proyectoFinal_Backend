import express from 'express'
import passport from 'passport'
import { isUser, isAdmin } from '../middlewares/middlewares.js'
import SessionController from '../controllers/sessionController.js'
const sessionController = new SessionController()

const router = new express.Router()


router.post('/register', passport.authenticate('register', {failureRedirect: '/auth/failedregistration'}), sessionController.register)
router.get('/failedregistration', sessionController.failedRegister)

router.post('/login', passport.authenticate('login', {failureRedirect: '/auth/failedlogin'}), sessionController.login)
router.get('/failedlogin', sessionController.failLogin)

router.get('/github', passport.authenticate('github', {scope: ['user: email']}))
router.get('/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user
    res.redirect('/home')
})

router.get('/logout', sessionController.logout)
router.get('/private', isAdmin, sessionController.isAdmin)
router.get('/current', isUser, sessionController.getCurrentSession)

export default router