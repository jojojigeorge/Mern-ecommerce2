import React from "react";

const ProductForm = ({value,setValue,handleSubmit,allcat}) => {

  // set product details form form
  const inputHandle = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (  
    <div>
      <form onSubmit={handleSubmit}>
      <div className="p-3 w-75 card">
        <label>Select Category:</label> 
        <select className="p-2" name="category" required  onChange={inputHandle}>
        <option value="">Pick an option</option>
          {allcat?.map((c) => (
            <option key={c._id}  value={c._id}>
              {c.category}  
            </option> 
          ))}
        </select>
        <label >Select Shipping</label>
        <select className="p-2" name="shipping" required onChange={inputHandle}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
        <input className="mt-3 p-1 " type="text" required name="name" value={value.name} placeholder="Enter Product Name " onChange={inputHandle} />
        <textarea className="mt-3 p-1 " type="text" required name="description" value={value.description} placeholder="Enter Product Description " onChange={inputHandle} />
        <input className="mt-3 p-1 " type="number" required name="price" value={value.price} placeholder="Enter Product Price " onChange={inputHandle} />
        <input className="mt-3 p-1 " type="number" required name="quantity" value={value.quantity} placeholder="Enter Product Quantity " onChange={inputHandle} />
        <input className="mt-3 p-1  " type="file" name="photo" accept="image/*" onChange={(e) => setValue({ ...value, photo: e.target.files[0] })} />
        {value.photo && (
          <div className="mb-3 text-center">
            <img src={URL.createObjectURL(value.photo)} height={"150px"} alt="" />
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-3" >
          Submit Product
        </button>
      </div>
      </form> 
    </div>
  );
};

export default ProductForm;
