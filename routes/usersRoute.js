import fs from 'fs'
import { Router } from "express"
const router = new Router()
import SessionController from '../controllers/sessionController.js'
const sessionController = new SessionController()
import UserService from '../services/usersService.js'
const userService = new UserService()
import { uploader, docsUploader } from "../utils/multer.js"
import { isAdmin } from "../middlewares/middlewares.js"


router.get('/', sessionController.getUsersController)

router.get('/premium/:uid', sessionController.updateRoleController)

router.get('/:uid/files', (req, res) => {
    const user = req.user
    res.render('uploadFiles', {user: user})
})

router.get('/:uid/documents', (req, res) => {
    const uid = req.params.uid
    const path = `${process.cwd()}/public/files/users/${uid}`
    const folderFound = fs.existsSync(path)

    if(!folderFound) {
        // si no existe la carpeta, la creamos
        fs.mkdirSync(path, {recursive: true})
    }
    res.render('uploadDocuments', {uid, folderFound})
})

router.get('/premiumdocs/:uid', (req, res) => {
    const user = req.user
    res.render('uploadDocuments', {user: user})
})


router.post('/:uid/files', uploader.fields([
        {name: 'profiles', maxCount: 1}, 
        {name: 'products', maxCount: 1}, 
        {name: 'documents', maxCount: 1}
    ]), (req, res) => {
    res.send({message: 'Files uploaded successfully'})
})

router.post('/:uid/documents', docsUploader.fields([
    {name: 'dni', maxCount: 1},
    {name: 'address', maxCount: 1},
    {name: 'accountStatus', maxCount: 1},
]), (req, res) => {
    res.send({message: 'Documents uploaded successfully. You can now upgrade to premium user.'})
})


router.delete('/', sessionController.deleteInactiveUsersController)
router.delete('/delete/:uid', sessionController.deleteUserContoller)

export default router