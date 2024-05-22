import React, { useEffect, useState } from "react";
import Layout from "./Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";

const Spinner = ({path='/login'}) => {
    const [count,setCount]=useState(3)
    const navigate=useNavigate()
    const location =useLocation()
    console.log('spinner',location) 
    console.log('spinner path',path)

    useEffect(()=>{
        const interval=setInterval(()=>{
            setCount((prev)=>--prev )
        },1000)
        count===0 && navigate(`${path}`,{
            state:location.pathname
        })
        return ()=> clearInterval(interval)
    },[count,navigate,location,path])
  return (
    <Layout>
      <div style={{ height: "85vh" }} className="d-flex flex-column justify-content-center align-items-center">
        <h3>redirecting to you in {count} seconds</h3>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </Layout>
  );
};

export default Spinner;
