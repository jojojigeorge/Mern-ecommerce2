import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {  
  const [product, setProduct] = useState({});
  const [similarproducts,setSimilarProducts]=useState([])
  const params = useParams();

  // context
  const [cartDetails, setCartDetails] = useCart();


  // get similar products
  const getSimilarProducts=async(pid,cid)=>{
    try {
      const {data}=await axios.get(`/api/v1/product/similar-product/${pid}/${cid}`)
      setSimilarProducts(data.similarproducts)
    } catch (error) {
      console.log('error in get similar products',error)
    }
  } 

  // get selected product details
  const getProductDetails = async () => {
    try { 
      const { data } = await axios.get(`/api/v1/product/get-productdetailswithcategory/${params.slug}`);
      setProduct(data.singleproduct);
      getSimilarProducts(data.singleproduct._id,data.singleproduct.category._id)
    } catch (error) {
      console.log("Error in get selected product details", error);
    }
  };

  // at start lading page
  useEffect(() => {
    if (params.slug) getProductDetails();
  }, [params.slug]); 
  

  return (  
    <>
      <Layout>  
        <div className="row container mt-3">    
          <div className="col-md-6  ">  
            <img className="ms-5" src={`${import.meta.env.VITE_BASE_URL}/api/v1/product/getproduct-photo/${product._id}`} height={300} width={"350px"} alt="photo" />
          </div>
          <div className="col-md-6 ">
            <h1 className="text-center">Product Details</h1>
            <p><strong className="">Name :</strong> {product.name}</p>
            <p><strong>Description :</strong> {product.description}</p>
            <p><strong>Price :</strong> {product.price}</p>
            <p><strong>Category : </strong>{product?.category?.category}</p>
            <button className="btn btn-secondary ms-1" onClick={(e) => {
                          e.preventDefault;
                          setCartDetails([...cartDetails, product]);
                          localStorage.setItem("cart", JSON.stringify([...cartDetails, product]));
                          toast.success("product added to cart");
                        }}>ADD TO CART</button> 
          </div>
        </div>    
        <hr />
        {/* show similar products */}
        <div><h5 className=" container">Similar Products</h5></div>
        <div className="d-flex container flex-wrap">
            {similarproducts?similarproducts.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "11rem", height:""}}>
                <Link to={`/product/${p.slug}`} className="product-link">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/api/v1/product/getproduct-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}  
                  style={{height:"11rem"}}  
                />  
                <div className="card-body text-center"> 
                  <h6 className="card-title">{p.name.substring(0, 14)}...</h6>
                  {/* <p className="card-text">
                    {p.description.substring(0, 30)}... 
                  </p> */}  
                  <p className="card-text"> ₹ {p.price}</p>
                  {/* <button className="btn btn-primary ms-1">More Details</button> */}
                  <button className="btn btn-secondary mt-1">ADD TO CART</button>
                </div>  
              </Link>
              </div>
            )):<h4>No similar products</h4>}
            </div>
      </Layout>
    </>
  );
};

export default ProductDetails;
