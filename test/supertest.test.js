import chai from "chai"
import supertest from "supertest"
import ProductService from "../services/productsService.js"
import UserService from "../services/usersService.js"
import { Cookie } from "express-session"

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing BySof', function() {
    this.timeout(15000)
    /* ---- describe api/sessions ---- */
    describe('Testing Sessions API', function() {
        // Test 1
        it('Registar un usuario: API POST /auth/register debe registrar un nuevo usuario correctamente', async function() {
            // given
            const newUser = {
                firstName: "Nombre de usuario",
                lastName: "Apellido de usuario",
                email: "userEmail@gmail.com",
                password: "thisisapassword1234",
                age: 20
            }

            // then
            const result = await requester.post('/auth/register').send(newUser)

            // assert
            expect(result.statusCode).is.ok.and.equal(302)
            expect(result.redirect).is.ok.and.equal(true)
        })
        // Test 2
        it("Loguear un usuario: API POST /auth/login debe loguear correctamente un usuario", async function() {
            // given
            const loginData = {
                email: "userEmail@gmail.com",
                password:"thisisapassword1234"
            }

            // then
            const result = await requester.post('/auth/login').send(loginData)

            // assert
            expect(result.statusCode).is.ok.and.equal(302)
            expect(result.redirect).is.ok.and.equal(true)
            expect(result.headers.location).is.ok.and.equal('/home')  
        })

        // Test 3
        it("Desloguear usuario: API GET /auth/logout debe desloguear al usuario", async function() {
            // given

            // then
            const result = await requester.get('/auth/logout')

            // assert
            expect(result.statusCode).is.ok.and.equal(302)
            expect(result.redirect).is.ok.and.equal(true)
            expect(result.headers.location).is.ok.and.equal('/api/session/login')
        })
    })


})