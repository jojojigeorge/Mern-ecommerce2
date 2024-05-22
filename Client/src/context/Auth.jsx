  import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
// import dotenv from "dotenv"
// dotenv.config()


const Authcontext=createContext()
const AuthProvider = ({children}) => {
  const [authDetails,setAuthDetails]=useState({user:"",token:""})
  // console.log('Token =>context/auth.jsx',authDetails.token)
  // default axios
  // axios.defaults.headers.common['Authorization']=authDetails?.token
  // console.log(process.env.PORT)
  // axios.defaults.baseURL = 'http://localhost:8081'
  axios.defaults.headers.common["Authorization"] = authDetails.token;
    useEffect(()=>{
      const data=localStorage.getItem('authDetails')
      if(data){
        const parseData=JSON.parse(data)
        setAuthDetails({
          ...authDetails,
          user:parseData.user,
          token:parseData.token
        })
        console.log('inside Auth authorization',parseData)
      }
    },[])
  return (
    <Authcontext.Provider value={[authDetails,setAuthDetails]}>
        {children}
    </Authcontext.Provider>
  )
}
// custom hook
const useAuth=()=>useContext(Authcontext)
// export const theme=()=>{return(useContext(TestStateContext))}
export {useAuth,AuthProvider}
