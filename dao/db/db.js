import mongoose from "mongoose"
import config from "../../config/config.js"
const URL = config.mongoURL

export default {
    URL,
    connect: () => {
        return mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true})
        .then((connect) => {
            console.log('Connected to DB')
        })
        .catch((err) => console.log(err))
    }
}