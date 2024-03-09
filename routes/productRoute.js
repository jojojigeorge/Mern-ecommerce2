import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from 'express-formidable';
import {  createOrder, createProductController, deleteProduct, filterProductByPriceCategory, getAllProduct, getProductDetails, getProductDetailsWithCategory, getProductPhoto, getSimilarProducts, numberofProducts, productListController, productSearch, updateProductController, verifyPaymentController } from "../controllers/ProductController.js";

const router=express.Router()
// create order
router.post("/create-order",requireSignIn,createOrder)
// verify payment
router.post("/verify-payment",requireSignIn,verifyPaymentController)

// create new product
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController)

// updating product 
router.put("/update-product/:id",requireSignIn,isAdmin,formidable(),updateProductController)

// get all product 
router.get("/get-allproduct",getAllProduct)

// get single product details
router.get("/get-productdetails/:slug",getProductDetails)

// get single product details to get similar
router.get("/get-productdetailswithcategory/:slug",getProductDetailsWithCategory)

// delete product
router.delete("/delete/:id",requireSignIn,isAdmin,deleteProduct)

// get photo product
router.get("/getproduct-photo/:id",getProductPhoto)

// filter product by price and category
router.post("/filter-product",filterProductByPriceCategory)

// product per page
router.get("/product-list/:page",productListController)
// no of products
router.get("/number-products",numberofProducts)

// search product
router.get("/search/:keyword",productSearch)

// similar product
router.get("/similar-product/:pid/:category",getSimilarProducts)




export default router