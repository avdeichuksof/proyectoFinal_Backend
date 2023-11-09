import UserService from "../services/usersService.js"
const userService = new UserService()
import User from "../dao/models/usersModel.js"
import UserDTO from "../dao/DTO/userDto.js"
import jwt from 'jsonwebtoken'
import EmailController from "../controllers/emailController.js"
const emailController = new EmailController()
import CartService from "../services/cartsService.js"
const cartService = new CartService()
import fs from "fs"

class SessionController {
    getUsersController = async (req, res) => {
        try {
            const users = await userService.getUsersService()
            
            res.status(200).send({ users: users })
        } catch (err) {
            res.status(404).send({ error: err })
        }
    }

    getUsersByIdContoller = async (req, res) => {
        try {
            const uid = req.params.uid
            const userFound = await userService.getUsersByIdService(uid)
            const showUser = new UserDTO(userFound)
            res.status(200).send({user: showUser})
        } catch (err) {
            res.status(404).send({ error: err })
        }
    }

    register = (req, res) => {
        try {
            if (!req.user) return res.status(400).send({ error: 'Error registering' })

            req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, password: req.session.password, age: req.user.age, cart: req.user.cart }

            return res.status(200).redirect('/api/session/login')
        } catch (err) {
            return res.status(500).send({ error: err.message })
        }
    }

    failedRegister = (req, res) => {
        return res.status(400).send({ error: 'Fail to register' })
    }

    login = (req, res) => {
        try {
            if (!req.user) return res.status(401).send({ error: 'Invalid credentials' })

            req.session.user = {
                _id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                password: req.user.password,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role,
                lastConnection: req.user.lastConnection
            }

            const showUser = new UserDTO(req.session.user)
            console.log(showUser)

            try {
                let token = jwt.sign(req.session.user, 'tokenSecreto', { expiresIn: '2000s' })
                console.log({ token, message: 'User logged in' })
                return res.redirect('/home')
            } catch (tokenError) {
                return next(tokenError)
            }
        } catch (err) {
            return res.status(500).send({ error: err.message })
        }
    }

    failLogin = (req, res) => {
        return res.status(400).send({ error: 'Fail to login' })
    }

    logout = async (req, res) => {
        const userId = req.session.user._id

        if (userId) {
            await userService.getLastConnectionService(userId, false)
                .then((lastConnection) => {
                    req.session.destroy((err) => {
                        if (err) return res.status(500).send({ error: 'Logout failed', detail: err })
                        console.log('Logged out')
                        res.redirect('/api/session/login')
                    })
                })
        } else {
            res.status(401).send('Error logging out')
        }
    }

    isAdmin = (req, res) => {
        res.send('Bienvenido admin!')
    }

    getCurrentSession = (req, res) => {
        const user = req.session.user
        const showUser = new UserDTO(user)
        return res.status(200).send({ user: showUser })
    }

    addDocumentsController = async (req, res) => {
        const userId = req.params.uid
        const validFiles = ["dni", "address", "accountStatus"].includes(req.file.originalname.split(".")[0])

        if (validFiles) {
            const document = {
                name: req.file.originalname,
                reference: req.file.path
            }
            await userService.addDocumentsService(userId, document)
            console.log('Documents uploaded')
            res.render('/home')
        } else {
            res.status(500).send({ message: 'There was an error uploading the documents.' })
        }

    }

    updateRoleController = async (req, res) => {
        const userId = req.params.uid
        const userFound = await userService.getUsersByIdService(userId)
        const userPath = `${process.cwd()}/public/files/users/${userId}`

        if(!userFound) res.status(404).send({message: 'User not found'})
        
        if(userFound.role === 'premium'){
            await userService.updateRoleService(userId)

            res.status(200).send({message: 'Role changed to user'})
        }

        if(userFound.role === 'user'){
            // leemos la carpeta del usuario
            const filesFound = fs.readdirSync(userPath)

            // verificamos que existan los documentos
            const dniDoc = filesFound.some(file => file.startsWith('dni-'))
            const addressDoc = filesFound.some(file => file.startsWith('address-'))
            const accountStatusDoc = filesFound.some(file => file.startsWith('accountStatus-'))

            if(dniDoc && addressDoc && accountStatusDoc){
                await userService.updateRoleService(userId)
                res.status(200).send({message: 'Role changed to premium'})
            }else{
                res.status(409).send({message: 'You need to have all documents before updating to premium'})
            }
        }

    }

    changePasswordController = async (req, res) => {
        await userService.changePasswordService(req.query.email, req.body.password)
        console.log('Password changed successfully')
        return res.status(200).redirect('/api/session/login')
    }

    deleteInactiveUsersController = async (req, res) => {
        const date = new Date()
        date.setDate(date.getDate() - 2)

        const inactiveUsers = await User.find({ lastConnection: { $lt: date }, role: { $ne: "admin" } })

        if (!inactiveUsers) {
            res.status(404).send({ message: 'No inactive users found' })
        } else {
            await userService.deleteInactiveUsersService(date)
            
            inactiveUsers.forEach(async (user) => {

                await cartService.deleteCartService(user.cart)

                const email = {
                    to: user.email,
                    subject: 'Cuenta eliminada',
                    text: 'Le informamos que su cuenta ha sido eliminada por inactividad mayor a dos días.',
                    html: `
                            <div class="container"> 
                                <h2> Datos de la cuenta eliminada </h2>
                                <p><b>Usuario:</b>${user.firstName}</p>
                                <p><b>Email:</b>${user.email}</p>
                                <p><b>Última conexión:</b>${user.lastConnection}</p>
                                
                                <h5> Si cree que se trata de un error, comuníquese con nosotros. </h5>
                                </div>
                                `
                }
                await emailController.sendEmail(email)
                res.status(200).send({message: 'Inactive users deleted successfully'})
            })
        }
    }

    deleteUserContoller = async (req, res) => {
        try {
            const uid = req.params.uid
            const userFound = await userService.getUsersByIdService(uid)
            if(!userFound) return ({message: 'User not found'})
            const cartId = userFound.cart
            await cartService.deleteCartService(cartId)
            
            const deleteUser = await userService.deleteUserService(uid)
            res.status(200).send({message: 'User deleted successfully', user: deleteUser})
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default SessionController


