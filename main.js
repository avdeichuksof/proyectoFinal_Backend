// server
import express from 'express'
const app = express()

// dependencies
import passport from 'passport'
import bodyParser from 'body-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './config/config.js'
import { specs } from './utils/swagger.js'
import handlebars from 'express-handlebars'
import swaggerUiExpress from 'swagger-ui-express'
import handlebarsHelpers from 'handlebars-helpers'
import initPassport from './config/passportConfig.js'

// http import
import http from 'http'
const server = http.createServer(app)

// socket import
import { Server } from 'socket.io'
const io = new Server(server)

// mongo
import DB from './dao/db/db.js'
import Product from './dao/models/productsModel.js'
import Message from './dao/models/messagesModel.js'
import ProductService from './services/productsService.js'
const productService = new ProductService()
import ProductController from './controllers/productsController.js'
const productController = new ProductController()

// routes
import authRoute from './routes/authRoute.js'
import chatRoute from './routes/chatRoute.js'
import homeRoute from './routes/homeRoute.js'
import cartsRoute from './routes/cartsRoute.js'
import usersRoute from './routes/usersRoute.js'
import loggerRoute from './routes/loggerRoute.js'
import mockingRoute from './routes/mockingRoute.js'
import sessionsRoute from './routes/sessionsRoute.js'
import productsRoute from './routes/productsRoute.js'
import realTimeRoute from './routes/realTimeProdsRoute.js'

// data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// dirname
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname + '/public')))

// views
const expressHandlebars = handlebars.create({
    helpers: handlebarsHelpers(),
    helpers: {
        calculateTotal: function(products) {
            let total = 0
            products.forEach(prod => {
                total += prod.product.price * prod.quantity
            })
            return total.toFixed(2)
        }
    }
})

app.engine('handlebars', expressHandlebars.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname + '/views'))

// session
app.use(session({
    store: MongoStore.create({
        mongoUrl: DB.URL
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// passport
initPassport()
app.use(passport.initialize())
app.use(passport.session())

// logger 
import addLogger from './services/logger/logger.js'
app.use(addLogger)

// swaggernpm
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// routes
app.use('/auth', authRoute)
app.use('/chat', chatRoute)
app.use('/home', homeRoute)
app.use('/api/users', usersRoute)
app.use('/api/carts', cartsRoute)
app.use('/loggerTest', loggerRoute)
app.use('/api/session', sessionsRoute)
app.use('/api/products', productsRoute)
app.use('/mockingproducts', mockingRoute)
app.use('/realtimeproducts', realTimeRoute)

// sockets
io.on('connection', async (socket) => {
    console.log('User connected')

    // PRODUCTS
    // mostramos todos los productos
    const products = productController.getProductsController
    socket.emit('products', products)

    socket.on('newProduct', async (data) => {
        console.log(data)
        const newProduct = new Product(data)
        const user = req.user

        if(!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock || !newProduct.category){
            CustomError.createError({
                name: "Product creation error",
                cause: createProductErrorInfo(newProduct),
                message: "Error creating Product - TEST",
                code: ErrorsEnum.INVALID_TYPES_ERROR
            })
        }

        await productService.addProductService(newProduct, user)
        const products = productController.getProductsController
        io.sockets.emit('all-products', products)
    })

    socket.on('deleteProduct', async (data) => {
        await Product.deleteOne({ _id: data })
        console.log('Product deleted')
        io.sockets.emit('all-products', products)
    }) 

    // CHAT
    const messages = await Message.find()
    socket.on('newMessage', async (data) => {
        const message = new Message(data)
        await message.save(data)
        io.sockets.emit('all-messages', messages)
    })
})


server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
    DB.connect()
})