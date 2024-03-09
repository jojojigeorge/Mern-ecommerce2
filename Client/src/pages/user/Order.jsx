import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import moment from "moment";
import { UserMenu } from "../../components/Layout/UserMenu";

const Order = () => {
  // context
  const [authDetails, setAuthDetails] = useAuth();

  const [userorder, setUserOrder] = useState([]);
  // get all user order
  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/user-order");
      setUserOrder([...userorder, ...data?.userorder]);
    } catch (error) {
      console.log("error in fetch all order details", error);
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, [authDetails?.token]);
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              {userorder.length>0 ? (  
                <>  
                  <div className="text-center pt-4">
                    <h4>Order Details</h4>  
                  </div>  
                  <div className="table-responsive">  
                    <table className="table ">
                      <thead>
                        <tr className="text-center">
                          <th scope="col">No</th>
                          <th scope="col"> date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Quantity</th>  
                          <th scope="col">Price</th>  
                        </tr> 
                      </thead>
                      <tbody className="text-center">
                        {userorder?.map((order, i) => {
                          let sum=0
                          order.products.map((i)=>sum=sum+(i.quantity))
                          return(
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{moment(order.createdAt).fromNow()}</td>
                            <td>{order.status}</td>
                            <td>{sum}</td>
                            <td>{order.payment.amount/100}</td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>  
                </>
              ):<h6 className="text-center">No order details</h6>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;
