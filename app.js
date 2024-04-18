const express=  require("express");
const mongoose = require("mongoose");
const bodyparser=require("body-parser");


mongoose.connect("mongodb://localhost:27017/sample",{useNewUrlParser:true,
useUnifiedTopology:true
}).then(()=>{
    console.log("connecting to mongodb")
}).catch((error)=>{
    console.log("cannot connect to mongodb",error)
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
app.post("/api/products",async(req,res)=>{
    const products=await Product.create(req.body)

    res.status(201).json({
        success:true,
        products
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
app.put("/api/products/:id",async(req,res)=>{
    let products = await Product.findById(req.params.id)
    products = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        useFindAndModify:false,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        products
    })
})

//delete
// Delete product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


app.listen(port,hostname,()=>{
    console.log(`your  server is working on http://localhost:4091/api/products`)
})