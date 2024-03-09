import React, { useEffect, useState } from "react";
import { AdminMenu } from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import SingleProduct from "./SingleProduct";

const AllProducts = () => {
  const [products, setProduct] = useState();  
  const [modelVisible,setModelVisible]=useState(false)
  const [updatedetails,setUpdateDetails]=useState({_id:'',photo:'', name: "", description: "", price: "", category: "", quantity: "", shipping: 0 })
  const [allcat,setAllCat]=useState()
  // get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-allproduct");
      if (data.success) {
        setProduct(data.allproduct);
      }
    } catch (error) {
      toast.error("Error in get all products");
      console.log(error);
    } 
  };  

  // delete product
  const handleDelete=async(pid)=>{
    try {
      const {data}=await axios.delete(`/api/v1/product/delete/${pid}`)
      if(data.success){
        toast.success("Product is deleted")
        getAllProducts()
      }
    } catch (error) {
      console.log(error)
      toast.error("Error in delete product")
    }
  }

  // get all product at start
  useEffect(() => {
    getAllProducts();
  }, []);

  // edit button click
  const handleEdit=async(p)=>{
    getAllCategory()
    setModelVisible(true)
    const {data}=await axios.get(`/api/v1/product/get-productdetails/${p.slug}`)
    setUpdateDetails(p=>({...p,...data.singleproduct}))
  }

  // get all category form backend
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      if (data.success) {
        setAllCat(data.allcategory);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong in fetching all category");
    }
  };

  // update product
  const handleUpdateProduct=async(e)=>{
    e.preventDefault()  
    try { 
      const {name,price,quantity,description,category,shipping,photo}=updatedetails
      const productData = new FormData();
      productData.append("name", name); 
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      updatedetails.photo && productData.append("photo", photo);
      productData.append("category", category);
      productData.append('shipping',shipping)
        const {data}=await axios.put(`/api/v1/product/update-product/${updatedetails._id}`,productData)
        setModelVisible(false)
        getAllProducts()
        if(data.success){
          toast.success(`${data.newProduct.name} is updateted`)
        }else{
          toast.error("not working")
        } 
    } catch (error) {
      console.log(error)
      toast.error("Error in create product")
    }
  }
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu /> 
          </div>
          <div className="col-md-9">
            <div className="card text-center w-75 p-3"><h4>All Products</h4></div>
            <br />
            <div className="p-3   d-flex flex-wrap">  
              {products?.map((p) => ( 
                <div key={p._id} >    
                  <div   className="card m-2" style={{ width: "18rem", height:'10rem' }} >
                    <Link to={`/dashboard/admin/view-product/${p.slug}`} className="product-link">
                      <div >
                        <img src={`/api/v1/product/getproduct-photo/${p._id}`} alt={p.name} style={{ height: "60px", width: "60px" }} className="card-img-top " />
                        <h6 className=" d-inline">{p.name.substring(0,25)}...</h6>
                        <p className="">{p.description.substring(0,30)}...</p>
                      </div>
                    </Link> 
                    <div className="text-center mb-2">
                      <button className="btn btn-outline-primary"onClick={()=>{handleEdit(p)}} >Edit</button>
                      <button className="ms-2 btn btn-outline-danger" onClick={()=>handleDelete(p._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Modal title={"Update Product Details"} footer={null} onCancel={() => setModelVisible(false)} open={modelVisible}>
              <SingleProduct handleSubmit={handleUpdateProduct} value={updatedetails} setValue={setUpdateDetails} allcat={allcat} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
