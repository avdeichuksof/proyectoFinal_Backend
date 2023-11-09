import User from '../models/usersModel.js'

class UserMethods{
    getUsersMethod = async () => {
        const users = await User.find().lean().select('firstName lastName email role _id')
        return users
    }

    getUserByIdMethod = async (id) => {
        const userFound = await User.findOne({_id: id})
        return userFound
    }

    getUserByEmailMethod = async (mail) => {
        const userFound = await User.findOne({email: mail})
        return userFound
    }

    addUserMethod = async (user) => {
        const newUser = await User.create(user)
        return newUser
    }

    updateUsertMethods = async (id, newData) => {
        const updateUser = await User.updateOne({ _id: id }, { $set: newData })
        return updateUser
    }

    deleteUserMethod = async (id) => {
        const deletedUser = await User.deleteOne({ _id: id })
        return deletedUser
    }
}

export default UserMethods