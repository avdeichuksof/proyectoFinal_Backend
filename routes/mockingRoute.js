import { Router } from "express"
import getProducts from '../controllers/fakerController.js'

const router = new Router()

router.get('/', getProducts)

export default router