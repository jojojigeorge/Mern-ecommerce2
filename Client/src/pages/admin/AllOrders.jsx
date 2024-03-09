import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import moment from "moment";
import { AdminMenu } from "../../components/Layout/AdminMenu";
import { Select } from "antd";
const { Option } = Select;
    
const AllOrders = () => {
  const [allorder, setAllOrder] = useState([]);
  const [selectedstatus, setSelectedstatus] = useState(["Not Processed", "Processing", "Order placed", "Shipping", "Deliverd", "Cancel"]);
  // context
  const [authDetails, setAuthDetails] = useAuth();  

  // get all user order 
  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-order");
      setAllOrder([...allorder, ...data?.allorder]);
    } catch (error) {
      console.log("error in fetch all order details", error);
    }
  };
// on status change
  const handleChange=async(e,orderId)=>{
    try {
        const {data}=await axios.put(`/api/v1/auth/update-orderstatus/${orderId}`,{status:e})
    } catch (error) {
        console.log("error in order staus update",error)
    }
  }
  useEffect(() => {
    getOrderDetails();
  }, []);
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <div className="text-center pt-4">
                <h4>All Order Details</h4>
              </div>
              <div className="table-responsive">
                <table className="table ">
                  <thead>
                    <tr className="text-center">
                      <th scope="col">No</th>
                      <th scope="col"> Buyer</th>
                      <th scope="col"> Date</th>    
                      <th scope="col">Status</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {allorder?.map((order, i) => {
                      let sum=0
                      order.products.map((i)=>sum=sum+(i.quantity))
                      return(
                      <tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{order.buyer.name}</td>
                        <td>{moment(order.createdAt).fromNow()}</td>
                        <td>
                          <Select className="" name="status" defaultValue={order.status} onChange={(e) => {handleChange(e,order._id)}}>
                            {selectedstatus?.map((st, i) => (
                              <Option value={st} key={i}>
                                {st}
                              </Option>
                            ))}   
                          </Select>
                        </td>
                        <td>{sum}</td>
                        <td>{order.payment.amount/100}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
