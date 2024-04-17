const express=require("express");
const mongoose = require("mongoose");
const bodyparser=require("body-parser");


mongoose.connect("mongodb://localhost:27017/sample",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connecting to mongodb")
}).catch((error)=>{
    console.log(error)
})

const app=express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.json());
const port=4091;
const hostname="localhost";


const Productschema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})

const Product=new mongoose.model("Product",Productschema);

//create product
app.post("/api/product",async(req,res)=>{
    const product=await Product.create(req.body)

    res.status(201).json({
        success:true,
        product
    })
})

//get products
app.get("/api/products",async(req,res)=>{
    const products=await Product.find();

    res.status(200).json({
        success:true,
        products
    })
})

//update products
app.put("/api/updateproducts/:id",async(req,res)=>{
    let productup = await Product.findById(req.params.id)
    productup = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new:true,useFindAndModify:false,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        productup
    })
})

//delete
app.delete("/api/updateproducts/:id",async(req,res)=>{
const product=await Product.findById(req.params.id);
 

if(!product){
    return res.status(500).json({
        success:false,
        message:"error found"
    })
}
await product.remove();

    res.status(200).json({
        success:true,
        message:"deleted sucessfully"
    })
})

app.listen(port,hostname,()=>{
    console.log(`your  server is working on http://localhost:4091/api/product`)
})