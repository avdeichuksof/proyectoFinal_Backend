import { Router } from "express"
const router = new Router()

router.get('/', (req, res) => {
    const user = req.session.user
    res.render('realTimeProducts', {user: user})
})


export default router