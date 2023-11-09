import dotenv from 'dotenv'
import fetch from 'node-fetch'
import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import {createHash, isValidPassword} from '../utils/bcrypt.js'
import UserService from '../services/usersService.js'
const userService = new UserService()
import User from '../dao/models/usersModel.js'
import Cart from '../dao/models/cartsModel.js'
import config from './config.js'

dotenv.config()

const LocalStrategy = local.Strategy

const initPassport = async () => {
    passport.use('register',
        new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email'},
            
            async (req, username, password, done) => {
                try{
                    let userData = req.body
                    // buscamos si existe el usuario
                    const userFound = await User.findOne({email: username})
                    if(userFound){
                        console.log('User already exists')
                        return done(null, false)
                    }

                    // setteamos el rol
                    const role = (userData.email === config.adminEmail && userData.password === config.adminPass) ? 'admin' : 'user'

                    // creamos carrito de usuario
                    const newCart = new Cart()

                    // creamos usuario
                    const newUser = {
                        email: username,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        password: createHash(userData.password),
                        cart: await newCart.save(),
                        age: userData.age,
                        role: role
                    }

                    // guardamos nuevo usuario
                    let userCreated = await userService.addUserService(newUser)
                    console.log('User registered')
                    done(null, userCreated)
                }catch(err){
                    return done('Error creating user' + err)
                }
            }
        )
    )

    passport.use('login',
        new LocalStrategy({usernameField: 'email'},
            async (username, password, done) => {
                try{
                    // buscamos el usuario
                    const userFound = await User.findOne({email: username})

                    // si no existe
                    if (!userFound) {
                        console.log('User not found')
                        return done(null, false)
                    }
                    // validamos password
                    if (!isValidPassword(password, userFound.password)) {
                        console.log('Invalid password')
                        return done(null, false)
                    }
    
                    // validamos admin session
                    if (userFound.email === config.adminEmail && userFound.password === config.adminPass) 
                    { req.session.admin = true }

                    userFound.lastConnection = await userService.getLastConnectionService(userFound.id, true)
                    
                    // todo ok
                    return done(null, userFound)
                }catch (err) {
                    return done(err)
                }
            }
        )
    )

    passport.use('github',
        new GitHubStrategy({
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: 'http://localhost:8080/auth/github/callback',
        },
            async (accessToken, _, profile, done) => {
                try{
                    // email config
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accessToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    })

                    const emails = await res.json()

                    const emailDetail = emails.find((email) => email.verified === true)

                    if(!emailDetail) return done(new Error('Cannot get a valid email for this user'))

                    profile.email = emailDetail.email
                    //end

                    // buscamos el usuario y si no existe lo creamos
                    const user = await User.findOne({email: profile.email})

                    if(!user){
                        const newUser = {
                            firstName: profile._json.firstName || profile._json.login || 'noname',
                            lastName: 'nolast',
                            email: profile.email,
                            password: ' ',
                            age: 'noage'
                        }
                        // seteamos rol
                        if (profile.email === config.adminEmail && profile.password === config.adminPass) {
                            profile.role = 'admin'
                        } else {
                            profile.role = 'user'
                        }
    
                        let userCreated = await userService.addUserService(newUser)
                        console.log({message: 'User registered', userCreated})
                        done(null, userCreated)
                    }else{
                        return done(null, user)
                    }
                }catch(err){
                    return done(err)
                }
            }
        )
    )

    // se activa cuando se crea el user y lo serializa
    passport.serializeUser((user, done) => {
        done(null, user._id)
    }),
    
    // deserializa cuando nos querramos loguear y da paso a la estrategia de login
    passport.deserializeUser(async (id, done) => {
        let user = await User.findById(id)
        done(null, user)
    })

}

export default initPassport