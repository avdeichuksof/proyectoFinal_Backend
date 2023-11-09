import { Router } from "express"
const router = new Router()

router.get('/', (req, res) => {
    req.logger.fatal(` ${req.method} - at ${new Date().toLocaleTimeString()}`)
    req.logger.error(` ${req.method} - at ${new Date().toLocaleTimeString()}`)
    req.logger.info(` ${req.method} - at ${new Date().toLocaleTimeString()}`)
    req.logger.http(` ${req.method} - at ${new Date().toLocaleTimeString()}`)
    req.logger.debug(` ${req.method} - at ${new Date().toLocaleTimeString()}`)
    res.send("Winston logger test")
})

export default router