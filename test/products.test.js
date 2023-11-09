import chai from "chai"
import mongoose from "mongoose"
import db from "../dao/db/db.js"
import UserService from "../services/usersService.js"
import ProductService from "../services/productsService.js"
import ProductsMethods from "../dao/methods/productsMethods.js"

db.connect()

const expect = chai.expect

describe('Test de Api Products', function(){
    this.timeout(15000)
    let prodId
    before(async function(){
        this.productService = new ProductService()
        this.productMethods = new ProductsMethods()
        this.userService = new UserService()
    })
    // Test 01
    it("Crear producto: API POST /api/products debe agregar un nuevo producto a la DB", async function(){
        // given
        const newProd = {
            title: "Product title",
            description: "Product description",
            price: 2000,
            thumbnail: "http://placekitten.com/200/300",
            code: "code1234",
            stock: 1,
            category: "artist"
        }
        
        const currentUser = await this.userService.getUsersByEmailService('userEmail@gmail.com')

        // then
        const result = await this.productService.addProductService(newProd, currentUser)
        prodId = result.product._id

        // assert
        expect(result.statusCode).to.be.equal(200)
        expect(result.product.status).is.ok.and.equal(true)
        expect(result.product).to.have.property("stock").that.is.not.equal(0)
    })

    // Test 02
    it("Buscar producto por ID: API GET /api/products/:id debe devolver el producto requerido", async function(){
        // given
        const id = prodId

        // then
        const result = await this.productService.getProductByIdService(id)

        // assert
        expect(result).is.not.null
        expect(result).is.ok
    })

    // Test 03
    it("Eliminar producto: API DELETE /api/products/:id debe eliminar un producto", async function(){
        // given
        const pid = prodId
        const currentUser = await this.userService.getUsersByEmailService('userEmail@gmail.com')

        // then 
        const result = await this.productService.deleteProductService(pid, currentUser)
        console.log(result)

    })
})

