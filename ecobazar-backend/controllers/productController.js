const { emptyFieldValidation } = require('../utils/validation')
const Product = require('../models/productModel')
const createProductController = async(req, res) => {
    const { title, price, category } = req.body
    emptyFieldValidation(res, title, price, category)

    let sku = `${Date.now()}-${new Date().getFullYear()}`

    let product = new Product({
        ...req.body,
        sku: sku
    })

    await product.save()

    res.json({
        success: true,
        message: "Product Created "
    })

}



const getProductController = async(req, res) => {

    try {
        let product = await Product.find({})

        res.json({
            success: true,
            product
        })

    } catch (error) {
        res.json({
            success: false,
            message: 'Server Error'
        })

    }
}



const getSingleProductController = async(req, res) => {
    try {
        const { id } = req.params

        const singleProduct = await Product.findOne({ _id: id })

        if (!singleProduct) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        res.json({
            success: true,
            product: singleProduct
        })

    } catch (error) {
        res.json({
            success: false,
            message: 'Server Error'
        })
    }

}


const productDeleteController = async(req, res) => {
    try {
        const { id } = req.params

        await Product.findByIdAndDelete(id)

        res.json({
            success: true,
            message: "Product deleted"
        })

    } catch (error) {
        res.json({
            success: false,
            message: 'Server Error'
        })
    }

}


const productUpdateController = async(req, res) => {
    try {
        const { id } = req.params
        const prodproductUpdate = await Product.findByIdAndUpdate({ _id: id }, req.body)

        res.json({
            success: true,
            message: 'Product Updated'
        })

    } catch (error) {
        res.json({
            success: false,
            message: 'Server Error'
        })
    }
}



module.exports = { createProductController, getProductController, getSingleProductController, productDeleteController, productUpdateController }