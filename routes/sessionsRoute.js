import { Router } from "express"
const router = new Router()
import SessionController from '../controllers/sessionController.js'
const sessionController = new SessionController()
import EmailController from "../controllers/emailController.js"
const emailController = new EmailController()

router.get('/login', (req, res) => {
    res.render('login', {})
})

router.get('/register', (req, res) => {
    res.render('register', {})
})

router.get('/forgottenpassword', (req, res) => {
    res.render("forgottenPassword",{})
})

router.post('/sendrecoverymail', emailController.sendRecoveryMail)

router.get('/restorepassword', (req, res) => {
    res.render('restorePassword', {})
})

router.post('/restorepassword', sessionController.changePasswordController)

export default router