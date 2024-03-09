import mongoose from "mongoose"

const orderSchema =new mongoose.Schema({
    products:[{
        type:mongoose.Schema.Types.Mixed,
        ref:'Product',
        quantity:Number
    }],
    payment:{},

    buyer:{
        type:mongoose.ObjectId,
        ref:'users'
    },
    status:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Processing","Order placed","Shipping","Deliverd","Cancel"]
    }

},{timestamps:true})

export default mongoose.model('Order',orderSchema)