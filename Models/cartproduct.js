const mongoose = require("mongoose")
const {Schema, model} = mongoose;

const cartProductSchema = new Schema({ 

    productid:{
        type: String,
        required: true
    },
    size:{
        type:String
    },
    user:{
        type:String,
        required: true

    },
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
    owner:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }


})

const cartProductModel = model("cartProduct", cartProductSchema);

module.exports = cartProductModel