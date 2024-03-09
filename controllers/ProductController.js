import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import orderModel from "../models/orderModel .js";
import * as crypto from "crypto";

dotenv.config();

var razorpayInstance = new Razorpay({
  key_id: "rzp_test_Wg7kegePFl1cq5",
  key_secret: "QhtPGEAr0l8Drug2oyHZsP2t",
});

// verify payment
export const verifyPaymentController = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.response;
  const { newOrder } = req.body;

  // Pass yours key_secret here
  const key_secret = "QhtPGEAr0l8Drug2oyHZsP2t";

  // STEP 8: Verification & Send Response to User

  // Creating hmac object
  let hmac = crypto.createHmac("sha256", key_secret);

  // Passing the data to be hashed
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);

  // Creating the hmac in the required format
  const generated_signature = hmac.digest("hex");

  if (razorpay_signature === generated_signature) {
    const neworder = await orderModel.findByIdAndUpdate(newOrder._id, { status: "Order placed" }, { new: true });
    res.status(200).send({ success: true, message: "new order placed", neworder });
  } else res.status(500).send({ success: false, message: "Error in verify payment" });
};

// create order
export const createOrder = (req, res) => {
  const { cartDetails } = req.body;
  let prod_qua_array=[]
  cartDetails.map((p)=>{
    
      prod_qua_array.push({prodId:p.product._id,quantity:p.quantity})
    
  })
  let total = 0;
  cartDetails.map((p) => (total = total + (p.product.price*p.quantity)*100));
  razorpayInstance.orders.create({ amount: Number(total), currency: "INR" }, async (err, order) => {
    const newOrder = await orderModel.create({
      products: prod_qua_array,
      payment: order,
      buyer: req.user._id,
    });
    //STEP 3 & 4:
    if (!err) res.status(200).send({ success: true, message: "New order added", newOrder, order });
    else res.status(500).send({ success: false, message: "Error in creating new order" });
  });
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !quantity || !shipping) {
      res.status(500).send({ success: false, message: "Please enter required field" });
    }
    if (photo && photo.size > 1000000) {
      res.status(500).send({ success: false, message: "Error in uploaded photo" });
    }
    const newProduct = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }
    await newProduct.save();
    res.status(200).send({ success: true, message: "New product added", newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in creating new product", error });
  }
};

// get all product
export const getAllProduct = async (req, res) => {
  try {
    const allproduct = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 });

    res.status(200).send({ success: true, message: "All product fetched", counTotal: allproduct.length, allproduct });
  } catch (error) {
    res.status(500).send({ success: false, message: "error in get all product" });
  }
};

// get single product details
export const getProductDetails = async (req, res) => {
  try {
    // const singleproduct=await productModel.findOne({slug:req.params.slug}).select("-photo")
    const singleproduct = await productModel.findOne({ slug: req.params.slug }).select("-photo");
    res.status(200).send({ success: true, message: "single product details fetched", singleproduct });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in get single product", error });
  }
};

// get single product details inside similar product
export const getProductDetailsWithCategory = async (req, res) => {
  try {
    
    // const singleproduct=await productModel.findOne({slug:req.params.slug}).select("-photo")
    const singleproduct = await productModel.findOne({ slug: req.params.slug }).populate("category").select("-photo");
    res.status(200).send({ success: true, message: "single product details fetched", singleproduct });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in get single product", error });
  }
};

// search  product details [header]
export const productSearch = async (req, res) => {
  const { keyword } = req.params;
  try {
    const searchresult = await productModel.find({ $or: [{ name: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }] }).select("-photo");
    // const singleproduct=await productModel.findOne({slug:req.params.slug}).populate('category').select("-photo")
    res.status(200).send({ success: true, message: "search product details fetched", searchresult });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error search product", error });
  }
};

// search  similar product
export const getSimilarProducts = async (req, res) => {
  const { pid, category } = req.params;
  try {
    const similarproducts = await productModel
      .find({ category: category, _id: { $ne: pid } })
      .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({ success: true, message: "similar product  fetched", similarproducts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error similar search product", error });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id).select("-photo");
    res.status(200).send({ success: true, message: "product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in delete product", error });
  }
};

// get product photo
export const getProductPhoto = async (req, res) => {
  try {
    const productphoto = await productModel.findById(req.params.id).select("photo");
    if (productphoto) {
      res.set("Content-type", productphoto.photo.contentType);
      res.status(200).send(productphoto.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in get photo", error });
  }
};

// no of product available
export const numberofProducts=async(req,res)=>{
  try {
    const count = await productModel.find({});
    // const count = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, message: "fetch the count of available products", countTotal: count.length});
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in no of available products", error });
  }
}

// product list per page
export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, message: "fetch product data per page",  products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in list product page", error });
  }
};

// filter product by price and category
export const filterProductByPriceCategory = async (req, res) => {
  try {
    // console.log('req.body',req.body,'req.fields',req.fields)
    const { selectedcat, radio } = req.body;
    // console.log(req.body)
    let args = {};
    if (selectedcat.length > 0) args.category = selectedcat;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args).select("-photo");
    res.status(200).send({ success: true, message: "filtered successfully", products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error filter by price and category", error });
  }
};

// update product details
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !quantity || !shipping) {
      res.status(500).send({ success: false, message: "Please enter required field" });
    }
    if (photo && photo.size > 1000000) {
      res.status(500).send({ success: false, message: "Error in uploaded photo" });
    }
    const newProduct = await productModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true });
    // const newProduct=new productModel({...req.fields,slug:slugify(name)})
    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }
    await newProduct.save();
    res.status(200).send({ success: true, message: " product updateted", newProduct });
  } catch (error) {
    console.log(error);
    // res.status(500).send({success:false,message:"Error in updating product",error})
  }
};
