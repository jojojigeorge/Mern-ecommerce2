import React ,{ useEffect, useState } from "react"
import { useAuth } from "../../context/Auth"
import { Outlet } from "react-router-dom"
import axios from "axios"
import Spinner from "../Spinner.jsx"

const PrivateRoute = () => {
  const [ok,setOk]=useState(false)
  const [authDetails,setAuthDetails]=useAuth()
  // const config = {
  //   headers: { 'Authorization': `Bearer ${authDetails.token}` }
  // };
  const header={
    "Content-Type":'application/json',
    "Authorization":`Bearer ${authDetails.token}`
  }

  useEffect(()=>{
    const authCheck=async()=>{
      try {
        const res=await axios.get('/api/v1/auth/user-auth',)
        if(res.data.ok){
          setOk(true)
        }else{
          setOk(false)
        }
        
      } catch (error) {
        console.log('error in header private')
      }
      
      // console.log('authDetails---------',authDetails?.user)
      
    }
    // console.log('authDetails => Private.jsx',authDetails)
    // console.log('ok value',ok)
    if(authDetails?.token)authCheck()
  },[authDetails?.token])
  return ok?<Outlet/>:<Spinner/>
}

export default PrivateRoute