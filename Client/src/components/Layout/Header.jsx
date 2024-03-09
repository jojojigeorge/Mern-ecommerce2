import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import toast from "react-hot-toast";
import SearchForm from "../Form/SearchForm";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const [authDetails, setAuthDetails] = useAuth();
  const [cartDetails,setCartDetails]=useCart()

  const handleLogout = () => {
    setAuthDetails({
      ...authDetails,
      user: "",
      token: "",
    });
    localStorage.removeItem("authDetails");
    localStorage.removeItem("cart");
    setCartDetails([])
    toast.success("logout successfully", { duration: 6000 });
  };
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg bg">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            EcommerceApp
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link " aria-current="page">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                    <NavLink to="/cart" className="nav-link ">
                      <div className="position-relative">Cart

                      <span className="position-absolute top-0 ms-2 start-100 translate-middle badge rounded-pill bg-dark">
                        {cartDetails.length}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                      </div>
                      
                    </NavLink>
                  </li>
    
              {authDetails.user ? (
                <>
                  {/* <li className="nav-item">
                    <NavLink to="/registration" className="nav-link">
                      Register
                    </NavLink>
                  </li> */}
                  
                </>
              ) : (
                <>
                  {/* // <li className="nav-item">
                  //   <NavLink onClick={handleLogout} to="/login" className="nav-link">
                  //     Logout
                  //   </NavLink>
                  // </li> */}
                </>
              )}
              <li className="nav-item dropdown ms-3">
                <ul className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {authDetails.user ? authDetails.user.name : "login"}
                </ul>
                {authDetails.user.name ? (
                  <>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li>
                        <NavLink to={`/dashboard/${authDetails.user.role === 1 ? "admin" : "user"}`} className="dropdown-item">
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink onClick={handleLogout} to="/login" className="dropdown-item">
                          Logout
                        </NavLink>
                      </li>
                      {/* <li><hr className="dropdown-divider" /></li>
                    <li><NavLink className="dropdown-item" >Something else here</NavLink></li> */}
                    </ul>
                  </>
                ) : (
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <NavLink to="/registration" className="dropdown-item">
                        Register
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/login" className="dropdown-item">
                        Login
                      </NavLink>
                    </li>
                    {/* <li><hr className="dropdown-divider" /></li>
                    <li><NavLink  className="dropdown-item" >Something else here</NavLink></li> */}
                  </ul>
                )}
              </li>

              {/* <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </li> */}
            </ul>
            <SearchForm />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
