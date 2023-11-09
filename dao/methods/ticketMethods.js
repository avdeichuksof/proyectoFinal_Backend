import Ticket from "../models/ticketModel.js"

class TicketMethods{
    createTicketMethod = async (newTicket) => {
        const newTkt = await Ticket.create(newTicket)
        return newTkt
    }

    getTicketsMethod = async () => {
        const tickets = await Ticket.find({})
        return tickets
    } 

    deletePurchaseMethod = async () => {
        const ticket = await Ticket.deleteMany({})
        return ticket
    }
}

export default TicketMethods