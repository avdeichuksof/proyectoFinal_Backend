import ErrorsEnum from '../errorsEnum.js'

export default (error, req, res, next) => {
    console.error('Error deetectao entrando al Error Handler')
    console.error(error.cause)

    switch(error.code){
        case ErrorsEnum.INVALID_TYPES_ERROR:
            res.status(400).send({status: 'Error', error: error.message})
            break;
        default:
            res.status(500).send({status: 'Error', error: 'Unhandled error'})
    }
}