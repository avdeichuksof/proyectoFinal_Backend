import CartService from "../services/cartsService.js"
const cartService = new CartService()
import TicketService from "../services/ticketService.js"
const ticketService = new TicketService()
import EmailController from "./emailController.js"
const emailController = new EmailController()

class CartController{
    getCartsController = async (req, res) => {
        try{
            let carts = await cartService.getCartsService()
            res.status(200).send({carts: carts})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    addCartController = async (req, res) => {
        try{
            let newCart = await cartService.addCartService()
            res.status(201).send({message: 'Cart created successfully', cart: newCart})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    getCartByIdController = async (req, res) => {
        try{
            const id = req.params.cid
            const user = req.session.user
            const cart = await cartService.getCartByIdService(id)
            res.render('cartView', {cart, user})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    addProductToCartController = async (req, res) => {
        try{
            const cartId = req.params.cid
            const prodId = req.params.pid
            const user = req.user
            const quantity = parseInt(req.body.quantity)
            await cartService.addProductToCartService(cartId, prodId, user, quantity)
            res.redirect('/home')
        }catch(err){
            console.log(err)
            res.status(400).send({error: err})
        }
    }

    updateQuantityController = async (req, res) => {
        try{
            const prodId = req.params.pid
            const cartId = req.params.cid
            const newQuantity = req.body
            const updateQuant = await cartService.updateQuantityService(cartId, prodId, newQuantity)
            res.status(200).send({message: 'Quantity updated', updateQuant})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    updateCartController = async (req, res) => {
        try {
            const cid = req.params.cid
            await cartService.updateCartService(cid, null, req.body)
            const cartFound = await cartService.getCartByIdService(cid)
            res.status(201).send({message: 'Cart updates successfully', cartFound})
        } catch (err) {
            res.status(400).send({error: err})
        }
    }

    deleteFromCartController = async (req, res) => {
        try{
            const prodId = req.params.pid
            const cartId = req.params.cid
            const deleteProduct = await cartService.deleteProductFromCartService(cartId, prodId)
            res.status(200).send({message: 'Product deleted from cart', product: deleteProduct})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    deleteCartController = async (req, res) => {
        try{
            const id = req.params.cid
            const deletedCart = await cartService.deleteCartService(id)
            res.status(200).send({message: 'Cart deleted successfully', cart: deletedCart})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    generatePurchaseController = async (req, res) => {
        try {
            const cid = req.params.cid
            const user = req.session.user.email 

            const cartFound = await cartService.getCartByIdService(cid)
            if(cartFound.products.length < 1){
                return res.send({message:'Cart is empty'})
            }

            const newTicket = await cartService.generatePurchase(user, cid)
            await cartService.updateProductsService(cid, newTicket.noStock)
            await ticketService.updateStockService(newTicket.prodStock)

            const newTkt = {
                id: newTicket.ticket._id,
                amount: newTicket.ticket.amount,
                purchaser: newTicket.ticket.purchaser
            }

            const email = {
                to: user,
                subject: 'Purchase',
                text: 'Gracias por su compra',
                html: `
                    <div class="container">
                        <h1> Resumen de compra </h1>
                            <div class="row">
                                <h4> Día: ${newTicket.ticket.purchase_datetime} </h4>    
                                <h3> Código: ${newTicket.ticket.code} </h3>
                                <h3> Total: ${newTicket.ticket.amount} </h3>
                            </div>
                    </div>
                `
            }

            await emailController.sendEmail(email)

            return res.status(200).send({message: 'Purchased', newTkt})
        } catch (err) {
            console.log(err)
            res.status(500).send({error: err})
        }
    }

    getPurchaseController = async (req, res) => {
        try {
            const ticket = await cartService.getPurchase()
            return res.status(200).send(ticket)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }

    deletePurchaseController = async (req, res) => {
        try {
            const deleted = await cartService.deletePurchase()
            return res.status(200).send(deleted)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }

}

export default CartController