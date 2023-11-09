export const createProductErrorInfo = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Propiedades requeridas:
            - title: type String, recibido: ${product.title}
            - description: type String, recibido: ${product.description}
            - price: type Number, recibido: ${product.price}
            - thumbnail: type String, recibido: ${product.thumbnail}
            - code: type String, recibido: ${product.code}
            - stock: type Number, recibido: ${product.stock}
            - status: type Boolean, recibido: ${product.status}
            - category: type String, recibido: ${product.category}
    `
}

export const userRegisterErrorInfo = (user) => {
    return ` Una o más propiedades fueron enviadas incompletas o no son válidas.
        Propiedades requeridas:
            - firstName: type String, recibido: ${user.title}
            - lastName: type String, recibido: ${user.lastName}
            - email: type String, recibido: ${user.email}
            - password: type String
            - age: type Number, recibido: ${user.age}
    
    `
}

/* export default {
    createProductErrorInfo,
    userRegisterErrorInfo
} */