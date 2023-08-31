const express = require("express")
const productrouter = express.Router()
const {cloudinary} = require("../Utils/cloudinary")
const checkauth = require("../Middleware/checkauth")
require("dotenv").config()
const ProductModel = require("../Models/Product")
const cartProductModel = require("../Models/cartproduct")
const OrdersModel = require("../Models/Orders")

productrouter.post("/createproduct",checkauth, async (req,res)=>{
    try {
        const {productname,price,quantity,description,owner,image,category} = req.body
        const uploadedResponse = await cloudinary.uploader.upload(image, {
            upload_preset: "Ecommerce"
        })

        // res.json({productname,price,quantity,description,owner,category})
        const productDoc = await ProductModel.create({
            productname,
            price,
            quantity,
            owner,
            image:uploadedResponse.secure_url ,
            description,
            category

        })

        res.json(productDoc)
         

        
    } catch (error) {
        res.status(400).json({error:"Upload Failed"})
    }
})

productrouter.get('/getallproducts', async (req, res) => {
    try {
      const limit = 12; // Set the maximum number of products to fetch
      // const products = await ProductModel.find().limit(limit);
      const products = await ProductModel.aggregate([
        { $sample: { size: limit } } // Fetch random 'limit' number of products
      ]);
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'fetching products' });
    }
  });


  productrouter.get("/getoneproduct/:id",async (req,res) => {
    try {
      const {id} = req.params
      const singleproduct = await ProductModel.findOne({_id : id})
      res.json(singleproduct)
    } catch (error) {
      res.status(400).json({error:"can't fetch product"})
      return
    }
     
  })


  productrouter.post("/addtocart",checkauth, async(req,res) => {
    try{
      const {category,description,image,owner,price,productname,size,user,_id} = req.body

      const cartproductDoc= await cartProductModel.create({
        productid:_id,
        size,
        user,
        productname,
        price,
        owner,
        image,
        category,
      })

      res.json(cartproductDoc)
  
    } catch(error){
      res.status(400).json({error:"Add to cart Failed!"})
      return
    }
  })


  productrouter.get("/cartmembers",checkauth,async(req,res) => {
    try {
      const CurrentUserEmail = req.Email
       const cartMembers = await cartProductModel.find({user:CurrentUserEmail})
       res.json(cartMembers)
      
    } catch (error) {
      res.status(400).json({error:"fethcing cart members failed"})
      return
      
    }
  })
  
  productrouter.delete("/deletefromcart/:id", checkauth, async(req,res) =>{
    try {
      const {id} = req.params
      const deletedItem = await cartProductModel.findByIdAndDelete({_id:id})
      if (!deletedItem) {
        // If the item was not found, return an error response
        return res.status(404).json({ error: "Item not found in the cart" });
      }
     
      const updatedCart = await cartProductModel.find();

    res.json(updatedCart)   
    } catch (error) {
      res.status(400).json({error:"couldn't delete the item from the cart"})
      return
    }
  })

  productrouter.post("/createorder",checkauth,async(req,res)=>{

    try {
      const {category,price,productid,productname,size,user} = req.body
      const orderdoc = await OrdersModel.create({
           productid,
           size,
           user,
           productname,
           price,
           category
      })

      res.json(orderdoc)
      
    } catch (error) {
      res.status(400).json({error:"Couldn't Place Order "})
      return
    }

  })
productrouter.get("/getonecategory/:category",async(req,res) => {
  try {
    const limit = 16
    const {category} = req.params
    const Products = await ProductModel.aggregate([
      { $match: { category } }, // Filter products by category
      { $sample: { size: limit } }, // Fetch random 'limit' number of products
    ]);


    res.json(Products)
    
  } catch (error) {
    res.status(400).json({error:"failed to fetch single cat data"})
    return
  }
})
module.exports = productrouter