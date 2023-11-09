import nodemailer from 'nodemailer'
import uuid4 from 'uuid4'
import config from "../config/config.js"
const mailAccount = config.mailAccount
const mailPass = config.mailPass
import User from '../dao/models/usersModel.js'
/* import UserService from '../services/usersService.js'
const userService = new UserService() */

let secrets = []

class EmailController {
    sendEmail = async (data) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: mailAccount,
                    pass: mailPass
                }
            })
    
            const mailOptions = {
                from: 'By Sof' + mailAccount,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html
            }
    
            let message = transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
        
                console.log(`Email sent to: ${mailOptions.to}`)
            })
    
        } catch (err) {
            console.log('Error sending mail', err)
        }
    }
    
    mailTimeout = (secret) => {
        secrets.push(secret)
        setTimeout( ()=>{
            secrets = secrets.filter( s => s != secret)
        },3600000)
    }

    sendRecoveryMail = async (req, res) => {
        try {
            const userEmail = req.body.email
            /* const userExists = await userService.getUsersByEmailService(userEmail) */
            const userExists = await User.find({email: userEmail})

            const secret = uuid4()
            this.mailTimeout(secret)

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: mailAccount,
                    pass: mailPass
                }
            })
    
            const mailOptions = {
                from: 'BySof' + mailAccount,
                to: userEmail,
                subject: 'Restore password',
                text: 'Se ha solicitado un cambio de contraseña',
                html: `
                    <div class="container"> 
                        <h2> Restauración de contraseña </h2>
                        <p> Ingrese al siguiente link para cambiar su contraseña: </p>
                        <p> Pasada una hora, el link expirará y se deberá solicitar nuevamente </p>
    
                        <a href="http://localhost:8080/api/session/restorepassword?secret=${secret}&email=${userEmail}"> Cambiar contraseña </a>
    
                        <h6> Si usted no solicitó un cambio de contraseña ignore este mail </h6>
                    </div>
                `,
                attachments: []
            }
    
            if(userExists){
                let message = transporter.sendMail(mailOptions, (err, info) => {
                    if(err) console.log(err)
                    console.log('Message sent: %s', info.messageId)
                })
            }
        } catch (err) {
            throw new Error('Error sending mail ' + err)
        }
    }

}

export default EmailController