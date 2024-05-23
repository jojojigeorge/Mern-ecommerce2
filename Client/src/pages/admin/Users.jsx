import Layout from "../../components/Layout/Layout";
import React from "react";
import { AdminMenu } from "../../components/Layout/AdminMenu";
// import Antd from "./Antd";

export const Users = () => {
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card text-center w-75 p-3">List of Users </div>
            {/* <Antd/> */}
          </div>  
        </div>
      </div>
    </Layout>
  );
};
