const mongoose = require("mongoose")
const {Schema, model} = mongoose;

const OrdersSchema = new Schema({ 

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
    category:{
        type:String,
        required:true
    }


})

const OrdersModel = model("Orders", OrdersSchema);

module.exports = OrdersModel