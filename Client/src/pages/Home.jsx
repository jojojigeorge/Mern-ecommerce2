import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import Card from "../components/Layout/Card.jsx";
import "../index.css";
import { Checkbox, Radio } from "antd";
import { Price } from "../components/Price.jsx";
import { useSearch } from "../context/Search.jsx";
import { Link } from "react-router-dom";  
import { useCart } from "../context/CartContext.jsx";
import Carousel from "../components/Layout/Carousel.jsx";

export const Home = () => {
  const [authDetails, setAuthDetails] = useAuth();
  const [cartDetails, setCartDetails] = useCart();

  const [allproducts, setAllProducts] = useState();
  const [allcategory, setAllCategory] = useState();
  const [selectedcat, setSelectedCat] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [totalproduct, setTotalproduct] = useState(0);

  // contex get search result
  const [value, setValue] = useSearch();

  // get total product number
  const numberOfProduct = async () => {
    const { data } = await axios.get(`/api/v1/product/number-products`);
    setTotalproduct(data.countTotal);
  };

  // get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      // const { data } = await axios.get("/api/v1/product/get-allproduct");
      if (data.success) {
        setAllProducts(data.products);
      }
    } catch (error) {
      toast.error("Error in get all products");
      console.log(error);
    }
  };

  // get all category form backend
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      if (data.success) {
        setAllCategory(data.allcategory);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong in fetching all category");
    }
  };

  // at start load allproduct
  useEffect(() => {
    getAllCategory();
    getAllProducts();
    numberOfProduct();
  }, []);

  // show search result
  useEffect(() => {
    if (value.result.length > 0) {
      setAllProducts(value.result);
    }
  }, [value]);

  // filter by category
  const handleFilter = (value, id) => {
    let checkedcategory = [...selectedcat];
    if (value) {
      checkedcategory.push(id);
    } else {
      checkedcategory = checkedcategory.filter((c) => c !== id);
    }
    setSelectedCat(checkedcategory);
  };

  // filter by price and category
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/filter-product", { selectedcat, radio });
      setAllProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("error in filter");
    }
  };
  useEffect(() => {
    if (radio.length || selectedcat.length) 
  {}  
    filterProduct();
  }, [radio, selectedcat]);

  // load more products
  const handlLoadmore = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      if (data.success) {
        setAllProducts([...allproducts, ...data?.products]);
      }
    } catch (error) {
      toast.error("Error in load more");
    }
  };
  useEffect(() => {
    console.log(import.meta.env.VITE_BASE_URL)
    if (page == 1) return;
    handlLoadmore();
  }, [page]);
  const handleAddToCart=(p)=>{
    
      // e.preventDefault;
      let mycart=[{product:'',quantity:''}]
      console.log('add to cart',mycart)
      mycart = [...cartDetails];
      let itemIndex = cartDetails.findIndex(item => item.product._id === p._id)
      if (itemIndex !== -1) {
        mycart[itemIndex].quantity++;
      } else {
        mycart.push({product:p,quantity:1});
      }
      setCartDetails(mycart);
      localStorage.setItem("cart", JSON.stringify(mycart));
      // setCartDetails([...cartDetails,{product:p,quantity:1}]);
      // localStorage.setItem("cart", JSON.stringify([...cartDetails, {product:p,quantity:1}]));
      toast.success("product added to cart");
    
  }
  return (
    <>
      <Layout>
        <div className="container-fluid row mt-3">
          <div className="col-md-2">
            <div className="text-center">
              <button className="btn btn-outline-success m-0" onClick={() => window.location.reload()}>
                Clear Filter
              </button>
            </div>
            <h5 className="text-center">Filter By Category</h5>
            <div className="d-flex flex-column">
              {allcategory?.map((c) => (
                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                  {c.category}
                </Checkbox>
              ))}
            </div>
            <h5 className="text-center mt-4">Filter By Price</h5>
            <div className="d-flex flex-column">
              <Radio.Group
                onChange={(e) => {
                  setRadio(e.target.value);
                }}
              >
                {Price?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))} 
              </Radio.Group>
            </div>
          </div>
          <div className="col-md-10">
            <h5 className="text-center">All Products</h5>
            <Carousel/> 
            <br />  
            <div className="d-flex flex-wrap">
              {allproducts ? (
                allproducts.map((p) => (
                  <div key={p._id} className="card m-2" style={{ width: "14rem", height: "" }}>
                    <Link to={`product/${p.slug}`} className="product-link">
                      <img src={`/api/v1/product/getproduct-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: "14rem" }} />
                    </Link>
                    <div className="card-body text-center">
                      <h6 className="card-title">{p.name.substring(0, 20)}...</h6>
                      
                      <p className="card-text"> ₹ {p.price}</p>
                      <button
                        className="btn btn-secondary mt-1"
                        onClick={()=>handleAddToCart(p)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-center">Loading...</p>
                  {/* {console.log('No result')} */}
                </div>
              )}
            </div>
            <div>
              {allproducts && allproducts.length < totalproduct && allproducts.length > 0 && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => p + 1);
                  }}
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
