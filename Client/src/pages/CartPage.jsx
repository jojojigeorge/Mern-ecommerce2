import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  let amount=0
  const navigate = useNavigate();
  const [authDetails, setAuthDetails] = useAuth();
  const [cartDetails, setCartDetails] = useCart();
  let newOrder = {};
  // calculate total cart price 
  const totalPrice = () => {
    let total = 0;
    cartDetails.map((p) => (total = total + (p.product.price*p.quantity)));
    return total;
  };
  // remove cart item from local storage
  const handleClearCart = () => {
      setCartDetails([]);
    localStorage.removeItem("cart");
  };  

  // handle checkout place order
  const handleCheckout = async (e) => { 
    try {
      const { data } = await axios.post("/api/v1/product/create-order", { cartDetails });
      amount=data.order.amount
      console.log('handleCheckout data:-',data)
      newOrder = data.newOrder;
      var options = {
        key: "rzp_test_Wg7kegePFl1cq5", // Enter the Key ID generated from the Dashboard
        amount:amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "MERN @2",
        description: "Test Transaction",
        // "image": "/favicon.png",
        order_id: data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          console.log('response',response)
          const { data } = await axios.post("/api/v1/product/verify-payment", { response, newOrder });
          if(data.success)
            handleClearCart()
          navigate("/dashboard/user/user-order")
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.log(response.error.code);
      });
      // document.getElementById('rzp-button1').onclick = function(e){
      rzp1.open();
      e.preventDefault();
      // }
    } catch (error) {
      console.log("error in handleCheckout", error);
    }
  };

  // remove cart item
  const removeCartItem = (pid) => { 
    try {
      const mycart = [...cartDetails];
      const index = mycart.findIndex((item) => item.product._id === pid);
      mycart.splice(index, 1);
      setCartDetails(mycart);
      localStorage.setItem("cart", JSON.stringify(mycart));
    } catch (error) {
      console.log("error in delete cart item", error);
    }
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">{`Hello ${authDetails?.token && authDetails?.user?.name}`}</h1>
            <h4 className="text-center">{cartDetails?.length ? `You Have ${cartDetails.length} items in your cart ${authDetails?.token ? "" : "please login to checkout"}` : " Your Cart Is Empty"}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 card p-4">
            {cartDetails?.map((p) => (
              <div key={p.product._id} className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img src={`/api/v1/product/getproduct-photo/${p.product._id}`} className="card-img-top" alt={p.product.name} width="100px" height={"100px"} />
                </div>
                <div className="col-md-8">
                  <p>{p.product.name}</p>
                  <p>{p.product.description.substring(0, 30)}</p>
                  <span>Price : {p.product.price}</span><span> X {p.quantity}</span><br />
                  <button className="btn btn-danger" onClick={() => removeCartItem(p.product._id)}>
                    Remove
                  </button>
                </div>  
              </div>
            ))}
          </div>
          <div className="col-md-6 text-center  card p-3 ">
            <div className="mt-5">
              <h4>Cart Summary</h4>
              <p>Total | Checkout | Payment</p>
              <h4>Total : ₹ {totalPrice()} </h4>
            </div>
            {authDetails?.token ? (
              <div className="row ">
                <div className="row  container ">
                  <div>
                    <p className="col m-3 card p-3">
                      Current Address <br />
                      Name :{authDetails.user.name} <br />
                      Address :{authDetails.user.address} <br />
                      Phone :{authDetails.user.phone} <br />
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-primary col m-4"
                  onClick={() => {
                    navigate("/dashboard/user/userprofile");
                  }}
                >
                  Update Address
                </button>
                <button id="rzp-button1" className="btn btn-success  col m-4" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => {
                    navigate("/login", { state: "/cart" });
                  }}
                >
                  Please login to checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
