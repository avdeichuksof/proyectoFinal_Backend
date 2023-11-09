import dotenv from 'dotenv'
import {Command} from 'commander'

const program = new Command()

program
    .option('-d', 'Variable de debug', false)
    .option('-p <port>', 'Puerto del servido', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse()

console.log('Mode options: ', program.opts().mode)

const environment = program.opts().mode

dotenv.config({
    path: environment === "production" ? "./.env" : "./.env"
})

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPass: process.env.ADMIN_PASS,
    mailAccount: process.env.GMAIL_ACCOUNT,
    mailPass: process.env.GMAIL_APP_PASSWORD,
    environment: environment
}