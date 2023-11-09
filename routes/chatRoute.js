import { Router } from "express"
const router = new Router()

router.get('/', (req, res) => {
    const user = req.session.user
    res.render('chat', {user: user})
})

export default router