import { Router } from 'express'
import CartController from '../controllers/cartsController.js'
const cartController = new CartController()
import { isUser } from '../middlewares/middlewares.js'

const router = new Router()

router.get('/', cartController.getCartsController)
router.get('/:cid', cartController.getCartByIdController)
router.get('/:cid/purchases', cartController.getPurchaseController)
router.get('/:cid/purchase', cartController.generatePurchaseController)

router.post('/', cartController.addCartController)
router.post('/:cid/product/:pid', isUser, cartController.addProductToCartController)

router.put('/:cid', cartController.updateCartController)
router.put('/:cid/products/:pid', cartController.updateQuantityController)

router.delete('/:cid', cartController.deleteCartController)
router.delete('/:cid/purchases', cartController.deletePurchaseController)
router.delete('/:cid/products/:pid', cartController.deleteFromCartController)

export default router