import swaggerJSDoc from 'swagger-jsdoc'


const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Documentación de API BySof - Proyecto Backend Coderhouse",
            desciption: "Documentación para uso de swagger"
        }
    },
    apis: ['./docs/**/*.yaml']
}

export const specs = swaggerJSDoc(swaggerOptions)

