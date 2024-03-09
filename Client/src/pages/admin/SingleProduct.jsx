import React from "react";
import { Select } from "antd"
const { Option } = Select

const SingleProduct = ({value,setValue,handleSubmit,allcat}) => {
  // set product details form form
  const inputHandle = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });  
  };
  return (  
    <div>   
      <div className="p-3 w-75 card">
        <label>Select Category:</label> 
        <Select className="" name="category" size="large" value={value.category} placeholder="Select form categories" showSearch  onChange={(val) =>setValue({ ...value, category: val })}>

          {allcat?.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.category}  
            </Option>
          ))}
        </Select>
        <label >Select Shipping</label>
        <Select className="" name="shipping" defaultValue={value.shipping?'Yes':"NO"}  onChange={(e) =>setValue({ ...value, shipping: e })}>
          <Option value="0">No</Option>
          <Option value="1">Yes</Option>  
        </Select>
        <input className="mt-3 p-1 " type="text"  name="name" value={value.name} placeholder="Enter Product Name " onChange={inputHandle} />
        <textarea className="mt-3 p-1 " type="text" name="description" value={value.description} placeholder="Enter Product Description " onChange={inputHandle} />
        <input className="mt-3 p-1 " type="number" name="price" value={value.price} placeholder="Enter Product Price " onChange={inputHandle} />
        <input className="mt-3 p-1 " type="number" name="quantity" value={value.quantity} placeholder="Enter Product Quantity " onChange={inputHandle} />
        <input className="mt-3 p-1  " type="file" name="photo" accept="image/*" onChange={(e) => setValue({ ...value, photo: e.target.files[0] })} />
        {value.photo ? (
          <div className="mb-3 text-center">
            <img src={URL.createObjectURL(value.photo)} height={"150px"} alt="" />
          </div>
        ):( 
          <div className="mb-3 text-center">
            <img src={`/api/v1/product/getproduct-photo/${value?._id}`} height={"150px"} alt="getphoto" />
          </div>  
        )}
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          Submit Product
        </button> 
      </div>  
    </div>
  );
};

export default SingleProduct;
