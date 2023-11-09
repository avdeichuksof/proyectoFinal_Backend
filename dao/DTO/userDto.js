class UserDTO{
    constructor(user){
        this.fullName = user.firstName + ' ' + user.lastName,
        this.email = user.email,
        this.role = user.role,
        this.cart = user.cart
    }
}

export default UserDTO