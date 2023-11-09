import { Schema, model } from "mongoose"
import uuid4 from "uuid4"

const TicketSchema = new Schema({
    code: {
        type: String,
        default: uuid4()
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number, 
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

const Ticket = model('Ticket', TicketSchema)
export default Ticket