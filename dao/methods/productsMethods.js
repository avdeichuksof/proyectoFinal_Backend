import Product from '../models/productsModel.js'

class ProductsMethods{
    getProductsMethods = async (category, limit, page, sort) => {
        try{
            const filter = category ? {category: category} : {} 
            const options = {
                limit: limit || 4,
                page: page || 1,
                sort: sort || 'asc'
            }

            if(sort){
                options.sort = {
                    price: sort
                }
            }

            const products = await Product.paginate(filter, options)
            return products
        }catch(err){
            console.log(err)
        }
    }

    addProductMethods = async (product) => {
        const newProduct = new Product(product)
        return newProduct.save()
    }

    getProductByIdMethods = async (id) => {
        const productFound = await Product.findById(id).lean()
        return productFound
    }

    updateProductMethods = async (id, newData) => {
        const updatedProduct = await Product.updateOne({_id: id}, newData)
        return updatedProduct
    }

    deleteProductMethods = async (id) => {
        const deletedProduct = await Product.deleteOne({_id: id})
        return deletedProduct
    }

}

export default ProductsMethods