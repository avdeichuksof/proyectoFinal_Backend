import generateProduct from "../utils/faker.js"

const getProducts = async (req, res) => {
    try {
        let products = []
        let numProds = 100
        for (let i = 0; i < numProds; i++){
            products.push(generateProduct())
        }
        res.send({status: 'success', payload: products})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err, message: 'Could not get products array'})
    }
}

export default getProducts