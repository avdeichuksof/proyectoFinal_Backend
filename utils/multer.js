import multer from "multer"

const storage = multer.diskStorage({
    // destino
    destination: function(req, file, cb){
        let uploadPath

        switch (file.fieldname) {
            case 'profile':
                uploadPath = `${process.cwd()}/public/files/profiles`
                break;
            case 'product':
                uploadPath = `${process.cwd()}/public/files/products`
                break;
            case 'document':
                uploadPath = `${process.cwd()}/public/files/documents`
        }

        cb(null, uploadPath)
    },
    filename: function(req, file, cb){
        const userId = req.params.uid
        cb(null, `${file.fieldname}-${Date.now()}-${userId}-${file.originalname}`)
    }
})

export const uploader = multer({
    storage: storage,
    // si se genera error, capturamos
    onError: function(err, next){
        console.log('error', err)
        next()
    }
})

const documentsStorage = multer.diskStorage({
    destination: function(req, file, cb){
        const userId = req.params.uid
        const userPath = `${process.cwd()}/public/files/users/${userId}`

        cb(null, userPath)
    },
    filename: function(req, file, cb){
        const userId = req.params.uid
        cb(null, `${file.fieldname}-${Date.now()}-${userId}-${file.originalname}`)
    }
})

export const docsUploader = multer({
    storage: documentsStorage,
    fileFilter: function(req, file, cb) {
        const validFiles = ["dni", "address", "accountStatus"]
        if(validFiles){
            cb(null, true)
        }else{
            cb(new Error("Invalid file name. Files must be named: dni - address - accountStatus"), false)
        }
    } ,
    // si se genera error, capturamos
    onError: function(err, next){
        console.log('error', err)
        next()
    }
})

