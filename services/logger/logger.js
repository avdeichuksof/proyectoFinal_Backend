import winston from "winston"
import config from "../../config/config.js"

const customOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customOptions.colors}), 
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customOptions.levels,
    transports: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({filename: './errors.log', level: 'error'})
    ]
})

const addLogger = (req, res, next) => {
    if(config.environment === 'production'){
        req.logger = prodLogger
    }else{
        req.logger = devLogger
    }
    next()
}

export default addLogger