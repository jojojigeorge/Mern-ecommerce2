import React from "react";
import Layout from "../../../components/Layout/Layout";
import { useAuth } from "../../../context/Auth";
import { useCart } from "../../../context/CartContext";

const CartPage = () => {
  const [authDetails, setAuthDetails] = useAuth();
  const [cartDetails, setCartDetails] = useCart();
  return (
    <Layout>
      <div className="container">
        <div className="col-md-12 mt-5 text-center">
          <h1>My Cart</h1>
          <h3 className="d-inline">{`Hello ${authDetails?.token && authDetails?.user.name},`}</h3>
          {cartDetails.length ? <h3 className="d-inline">You have {cartDetails.length} items</h3> : <h3 className="d-inline">Your cart is empty</h3>}
          {authDetails.token ? "" : <h3 className="d-inline">Please login to checkout</h3>}
        </div>
        <div className="col-md-7 p-4">
          <div className="table-responsive  pt-4 pb-4">
            <table className="table text-center">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  {/* <th scope="col">Quantity</th> */}
                </tr>
              </thead>
              {cartDetails.map((p) => (
                <tbody key={p._id}>
                  <tr>
                    <td>
                      <img src={`http://localhost:8081/api/v1/product/getproduct-photo/${p._id}`} className="card-img-top p-2" alt={p.name} style={{ height: "60px", width: "60px" }} />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          <div className="col-md-3 bg-success">checkout</div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
