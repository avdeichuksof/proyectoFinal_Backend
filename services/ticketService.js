import TicketMethods from "../dao/methods/ticketMethods.js"
const ticketMethods = new TicketMethods()
import ProductsService from "./productsService.js"
const productsService = new ProductsService()

class TicketService {
    createTicketService = async (newTicket) => {
        const newTkt = await ticketMethods.createTicketMethod(newTicket)
        return newTkt
    }

    getTicketsService = async () => {
        const tickets = await ticketMethods.getTicketsMethod()
        return tickets
    }

    updateStockService = async (stock) => {
        try {
            for (const product of stock) {
                await productsService.updateStockService(product.id, product.stock)
                console.log('Stock modificado')
            }
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }

    deletePurchaseService = async () => {
        const ticket = await ticketMethods.deletePurchaseMethod()
        return ticket
    }
}

export default TicketService