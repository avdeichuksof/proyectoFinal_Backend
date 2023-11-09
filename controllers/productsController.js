import ProductService from '../services/productsService.js'
const productService = new ProductService()


class ProductController{
    getProductsController = async (req, res) => {
        try{
            let {category, limit, page, sort} = req.query
            
            if(sort && (sort !== 'asc' && sort !== 'desc')){
                sort = '' 
            }else if (sort == 'asc'){
                sort = 1
            }else{
                sort = -1
            }

            const data = await productService.getProductsService(category, limit, page, sort)
            
            let products = data.docs.map((product) => {
                return { title: product.title,
                        _id: product._id,
                        price: product.price,
                        description: product.description, 
                        thumbnail: product.thumbnail, 
                        code: product.code, 
                        stock: product.stock, 
                        status: product.status, 
                        category: product.category 
                }
            })
        
            const {docs, ...rest} = data
            let links = []
        
            for(let i = 1; i < rest.totalPages + 1; i++){
                links.push({label: i, href: 'http://localhost:8080/home/?page=' + i})
            }
            
            const user = req.session.user

            return res.render('index', {products: products, pagination: rest, links, user: user})
        }catch(err){
            throw new Error(err)
        }
    }

    getProductsByIdController = async (req, res) => {
        try{
            const id = req.params.id
            const user = req.session.user
            const productFound = await productService.getProductByIdService(id)
            console.log("producto: ", productFound)
            res.render('productView', {product: productFound, user: user})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    addProductController = async (req, res) => {
        try{
            const currentUser = req.session.user
            const newProduct = await productService.addProductService(req.body, currentUser)

            res.status(201).send({message:'Product created successfully', product: newProduct, user: currentUser})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    updateProductController = async (req, res) => {
        try{
            const id = req.params.id
            const newData = req.body
            const updatedProduct = await productService.updateProductService(id, newData)
            res.status(200).send({message: 'Product updated successfully', product: updatedProduct})
        }catch(err){
            res.status(400).send({error: err})
        }
    }

    deleteProductController = async (req, res) => {
        try{
            const id = req.params.id
            const user = req.session.user
            const deletedProduct = await productService.deleteProductService(id, user)

            if(deletedProduct.owner === 'premium'){
                const email = {
                    to: deletedProduct.owner,
                    subject: 'Producto eliminado',
                    text: 'Le informamos que un producto publicado por usted fue eliminado.',
                    html: `
                        <div class="container"> 
                            <h2> Producto eliminado: </h2>
                            <p>${deletedProduct.title}</p>
                            <h5> Si cree que se trata de un error, comuníquese con nosotros. </h5>
                        </div>
                    `
                }
                await emailController.sendEmail(email);
            }

            res.status(200).send({message: 'Product deleted successfully', product: deletedProduct})
        }catch(err){
            res.status(400).send({error: err})
        }
    }
}

export default ProductController