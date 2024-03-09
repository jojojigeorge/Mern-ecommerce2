import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { AdminMenu } from "../../components/Layout/AdminMenu";
import { Select } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import ProductForm from "../../components/Form/ProductForm";
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

export const CreateProduct = () => {
  const navigate=useNavigate()
  const [allcat, setAllCat] = useState([]); 
  const [productdetails, setProductdetails] = useState({photo:'', name: "", description: "", price: "", category:'', quantity: "", shipping: 0 });
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

  //call at loading the page
  useEffect(() => {
    getAllCategory();
  }, []);

 
  const handleCreate=async(e)=>{
    e.preventDefault()
    try { 
      const {name,price,quantity,description,category,shipping,photo}=productdetails
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append('shipping',shipping)
        const {data}=await axios.post("/api/v1/product/create-product",productData)
        if(data.success){
          navigate('/dashboard/admin/view-allproducts')
          toast.success(`${data.newProduct.name} is created`)
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
          <div className="col-md-9 ">
            <div className="card text-center w-75 p-3"><h4>Create Product</h4></div>
            <br />
            <ProductForm handleSubmit={handleCreate} allcat={allcat}  setValue={setProductdetails} value={productdetails} />


            {/* <div className="p-3 w-75 card">
              <label>Select Category:</label>
              <select className="p-2" name="category" onChange={inputHandle}>

                {allcat?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.category}  
                  </option>
                ))}
              </select>
              <label htmlFor="">Select Shipping</label>
              <select className="p-2" name="shipping" onChange={inputHandle}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select> 
              <input className="mt-3 p-1 " type="text" name="name" value={productdetails.name} placeholder="Enter Product Name " onChange={inputHandle} />
              <input className="mt-3 p-1 " type="text" name="description" value={productdetails.description} placeholder="Enter Product Description " onChange={inputHandle} />
              <input className="mt-3 p-1 " type="number" name="price" value={productdetails.price} placeholder="Enter Product Price " onChange={inputHandle} />
              <input className="mt-3 p-1 " type="number" name="quantity" value={productdetails.quantity} placeholder="Enter Product Quantity " onChange={inputHandle} />
              <input className="mt-3 p-1  " type="file" name="photo" accept="image/*"  onChange={(e) =>setProductdetails({ ...productdetails, photo: e.target.files[0] })} />
              {productdetails.photo && (
                <div className="mb-3 text-center">
                  <img src={URL.createObjectURL(productdetails.photo)} height={"150px"} alt="" />
                </div>
              )}
              <button className="btn btn-primary mt-3" onClick={handleCreate}>Create Product</button>
            </div> */}
          </div> 
            


        </div>
      </div>
    </Layout>
  );
};
