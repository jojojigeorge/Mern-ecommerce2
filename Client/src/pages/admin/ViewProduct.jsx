import Layout from "../../components/Layout/Layout";
import { AdminMenu } from "../../components/Layout/AdminMenu";
import SingleProduct from "./SingleProduct";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ViewProduct = () => {
  const navigate=useNavigate()
  const params = useParams();
  const [allcat,setAllCat]=useState()
  const [productdetails,setProductDetails]=useState({_id:'',photo:'', name: "", description: "", price: "", category: "", quantity: "", shipping: 0 })

  // get single product details using slug
  const getSingleProduct=async()=>{
    try {
      const {data}=await axios.get(`/api/v1/product/get-productdetails/${params.slug}`)
      setProductDetails((p)=>({...p,...data.singleproduct}))
    } catch (error) {
      console.log(error)
    }
  }
  // get all category
  const getAllCategory=async()=>{ 
    try {
      const {data}=await axios.get('/api/v1/category/all-category')
      setAllCat(data.allcategory)
    } catch (error) {
      console.log(error)
      toast.error("Error in fetch all category")
    }
  }
  const goback=()=>{
    navigate(-1)
  }

  // load product details at start the page
  useEffect(()=>{
    getSingleProduct()
    getAllCategory()
  },[])

  return (
    <Layout>  
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card text-center w-75 p-3"><h4>View Product Details</h4></div>
            <SingleProduct handleSubmit={goback} allcat={allcat}  setValue={setProductDetails} value={productdetails} />
    
          </div>
        </div>
      </div>
    </Layout>
  );  
};
export default ViewProduct