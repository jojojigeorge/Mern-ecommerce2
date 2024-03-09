import React, { useRef } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Auth";

function ForgotPassword() {
  const [authDetails,setAuthDetails] =useAuth()
  const nameRef = useRef();
  const questionRef = useRef();
  const newpasswordRef=useRef();
  

  const navigate = useNavigate();
  const location =useLocation()
  // console.log("inside login",location)

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = nameRef.current.value;
    const question = questionRef.current.value;
    const newpassword = newpasswordRef.current.value;
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", { email, newpassword ,question});
      if (res.data.success) {
        setAuthDetails({
          ...authDetails,
          user:res.data.user,
          token:res.data.token
        })
        localStorage.setItem("authDetails",JSON.stringify(res.data))
        toast.success(res.data.message);
        // console.log('first',location.state)
        navigate(location.state || "/")
      } else {
        toast(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Layout>
      <div className="container mt-5 ">
        <div className="card container shadow-lg " style={{ width: "30rem" }}>
          <div className="display-6 text-center mt-4">Forgot Password </div>
          <hr />
          <div className="card-body  ">
            <form>
              <div className="mb-">
                <label htmlFor="email-reg" className="form-label">
                  Username
                </label>
                <input type="text" ref={nameRef} className="form-control" placeholder="Enter Username" id="email-reg" name="email" />
              </div>
              <div className="">
                <label htmlFor="password-reg" className="form-label">
                  Your secret code
                </label>
                <input type="password" ref={questionRef} className="form-control" placeholder="Your secret question-answer" id="question-reg" name="question" />
              </div>
              <div className="mb-3">
                <label htmlFor="password-reg" className="form-label">
                  New password
                </label>
                <input type="password" ref={newpasswordRef} className="form-control" placeholder="Enter Password" id="newpassword-reg" name="newpassword" />
              </div>
              

              <div className="text-center">
                <button type="" onClick={handleLogin} className="btn btn-primary">
                  Submit
                </button>
                {/* <button className="btn btn-primary" onClick={()=>{navigate("/forgotpassword")}}>Forgot Password</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
