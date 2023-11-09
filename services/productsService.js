import ProductsMethods from '../dao/methods/productsMethods.js'
const productMethods = new ProductsMethods()
import CustomError from './errors/customErrors.js'
import ErrorsEnum from './errors/errorsEnum.js'
import {createProductErrorInfo} from './errors/messages/errorMessages.js'

class ProductService{
    getProductsService = async (category, limit, page, sort) => {
        try{
            const data = await productMethods.getProductsMethods(category, limit, page, sort)
            return data
        }catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    }

    getProductByIdService = async (id) => {
        try{
            const productFound = await productMethods.getProductByIdMethods(id)
            return productFound
        }catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    }


    addProductService = async (newProduct, currentUser) => {
        try{
            if(!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock || !newProduct.category){
                CustomError.createError({
                    name: "Product creation error",
                    cause: createProductErrorInfo(newProduct),
                    message: "Error creating Product - TEST",
                    code: ErrorsEnum.INVALID_TYPES_ERROR
                })
            }

            if (currentUser && currentUser.role) {
                if (currentUser.role === 'premium') {
                    newProduct.owner = currentUser.email
                } else if (currentUser.role === 'user') {
                    throw new Error('Permission to add product denied. You must be an admin or a premium user')
                } else {
                    newProduct.owner = 'admin'
                }
            } else {
                // para subir desde postman
                newProduct.owner = 'admin'
            }
            
            const product = await productMethods.addProductMethods(newProduct)
            if(product) console.log({message: 'Product added successfully', product: product})

            return product
        }catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    }

    updateProductService = async (id, newData) => {
        try{
            const productFound = await productMethods.getProductByIdMethods(id)
            if(!productFound) throw new Error('Product not found, invalid ID')
            
            const updatedProduct = await productMethods.updateProductMethods(id, newData)
            if(updatedProduct) console.log({message: 'Product updated successfully', product: updatedProduct})

            return updatedProduct
        }catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    }

    updateStockService = async (id, stock) => {
        try {
            if(!id) console.log('Invalid ID')

            const updateStock = await productMethods.updateProductMethods(id, { stock: stock })
            console.log('Stock updated successfully')

            return updateStock
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }

    deleteProductService = async (id, user) => {
        try{
            const productFound = await productMethods.getProductByIdMethods(id)
            if(!productFound) throw new Error('Product not found, invalid ID')

            if(user.role === 'admin' || ( user.role === 'premium' && user.email === productFound.owner)){
                const deleteProduct = await productMethods.deleteProductMethods(id)
                if(deleteProduct) console.log({message: 'Product deleted successfully', product: deleteProduct})
            }else{
                console.log('Error deleting product. You are not the owner or an admin')
                return false
            }
        }catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    }

    getProductsDataService = async (arr) => {
        const productsData = []

        for(const id of arr) {
            const productFound = await this.getProductByIdService(id)
            productsData.push(productFound)
        }
        
        return productsData
    }

}

export default ProductService