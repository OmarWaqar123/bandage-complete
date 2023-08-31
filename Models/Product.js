const mongoose = require("mongoose")
const {Schema, model} = mongoose;

const ProductSchema = new Schema({ 

    productname: {
        type: String,
        required: true,
        min:2,
        max:70,    
    },
    price:{
        type: Number,
        required: true,
        min:1,
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    owner:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        min:5
    },
    category:{
        type:String,
        required:true
    }


})

const ProductModel = model("Product", ProductSchema);

module.exports = ProductModel