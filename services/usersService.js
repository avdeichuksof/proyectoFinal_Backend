import UserMethods from "../dao/methods/usersMethods.js"
const userMethods = new UserMethods()
import {createHash, isValidPassword} from '../utils/bcrypt.js'
import User from "../dao/models/usersModel.js"

class UserService {
    getUsersService = async () => {
        try{
            const users = await userMethods.getUsersMethod()
            return users
        }catch(err){
            throw new Error(err.message)
        }
    }

    getUsersByIdService = async (id) => {
        try{
            const userFound = await userMethods.getUserByIdMethod(id)
            return userFound
        }catch(err){
            throw new Error(err.message)
        }
    }

    getUsersByEmailService = async (email) => {
        try {
            const userFound = await userMethods.getUserByEmailMethod(email)
            return userFound
        } catch (err) {
            throw new Error(err.message)
        }
    }

    addUserService = async (user) => {
        try{
            if(!user.email || !user.firstName || !user.lastName || !user.password || !user.age){
                CustomError.createError({
                    name: 'User registering error',
                    cause: userRegisterErrorInfo(user),
                    message: 'Error registering user - TEST',
                    code: ErrorsEnum.INVALID_TYPES_ERROR
                })
            }

            const newUser = await userMethods.addUserMethod(user)

            return newUser
        }catch(err){
            throw new Error(err.message)
        }
    }

    updateRoleService = async (id) => {
        try{
            const userFound = await this.getUsersByIdService(id)
            
            if (!userFound) throw new Error("User not found.")

            if (userFound.role === 'user') {
                await userMethods.updateUsertMethods(id, { role: 'premium' })
            } 
            if (userFound.role === 'premium') {
                await userMethods.updateUsertMethods(id, { role: 'user' })
            }

        }catch(err){
            throw new Error(err.message)
        }
    }

    changePasswordService = async (userEmail, newPassword) => {
        const userFound = await userMethods.getUserByEmailMethod(userEmail)
        
        if(isValidPassword(newPassword, userFound.password)){
            throw new Error('You cannot reuse your previous password')
        }else{
            const updatePassword = await userMethods.updateUsertMethods(userFound._id, {password: createHash(newPassword)})
    
            if(updatePassword){
                return {message: 'Password updated successfully'}
            }else{
                throw new Error('There was an error updating your password')
            }
        }
    }

    getLastConnectionService = async (id, isLogged) => {
        const lastConnection = new Date().toString()

        const userFound = await this.getUsersByIdService(id)
        if(userFound){
            if(isLogged){
                await userMethods.updateUsertMethods(id, {lastConnection: lastConnection})
            }
            return lastConnection
        }else{
            return false
        }
    }

    addDocumentsService = async (id, document) => {
        try {
            const userFound = await this.getUsersByIdService(id)
            if(!userFound) throw new Error('User not found.')

            const docExists = userFound.documents.find(doc => doc.name === document.name)
            if(docExists) throw new Error(`Document ${document.name} already exists`)
            
            const documents = [...userFound.documents, document]
            const updateUser = await userMethods.updateUsertMethods(id, {documents: documents})
            return updateUser
        } catch (err) {
            throw new Error(err)
        }
    }

    deleteInactiveUsersService = async (date) => {
        const inactiveUsers = await User.deleteMany({lastConnection: {$lt: date}, role: {$ne: "admin"}})
        return inactiveUsers
    }

    deleteUserService = async (id) => {
        const deleteUser = await userMethods.deleteUserMethod(id)
        return deleteUser
    }
}

export default UserService