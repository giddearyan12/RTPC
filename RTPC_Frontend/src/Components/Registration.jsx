import React, { useState } from "react";
import "./Registration.css";
import rocket from "../assets/rocket.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./MainHome/Chat/Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const Registration = () => {
  const url = "http://localhost:5000";
  const [curr, setCurr] = useState("Register");
  const { setAuthUser } = useAuthContext();
  const [role, setRole] = useState("user"); // ✅ New state for role (user/admin)

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    en: "",
    password: "",
    conpass: "",
    department: "",
    gender: "",
    college: "",
    domain: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    let newUrl = url;
    if (curr === "Login") {
      newUrl += "/user/login";
    } else {
      newUrl += "/user/register";
    }

    const loadingToast = toast.loading(curr === "Login" ? "Signing in..." : "Registering...");

    try {
      const response = await axios.post(newUrl, { ...data, role });

      if (response.data.success) {
        toast.dismiss(loadingToast);
        if (response.data.data.role === "admin") {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("chat-user", JSON.stringify(response.data.data));
          setAuthUser(response.data.data);
          navigate("/admin"); 
          toast.success("Admin Login Successful");
        } else {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("chat-user", JSON.stringify(response.data.data));
          setAuthUser(response.data.data);
          navigate("/home");
          toast.success("User Login Successful");
        }
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.log("An error occurred. Please try again.", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const showLogin = () => {
    setCurr(curr === "Register" ? "Login" : "Register");
  };

  return (
    <div className="reg-page">
      <div className="reg-welcome">
        <img src={rocket} alt="" />
        <h2>Welcome</h2>
        <p>PROYECTA MINDS</p>
        <button onClick={showLogin}>
          {curr === "Register" ? "Login" : "Register"}
        </button>
      </div>
      <form onSubmit={onLogin} className="reg-form">
        {curr === "Register" ? (
          <>
            <h2>REGISTRATION</h2>
            <div className="flex">
              <input onChange={onChangeHandler} name="name" type="text" placeholder="Name..." required />
              <input onChange={onChangeHandler} name="email" type="email" placeholder="Email..." required />
            </div>
            <div className="flex">
              <input onChange={onChangeHandler} name="phone" type="number" placeholder="Phone..." required />
              <input onChange={onChangeHandler} name="en" type="text" placeholder="EN no..." required />
            </div>
            <div className="flex">
              <input onChange={onChangeHandler} name="password" type="password" placeholder="Password..." required />
              <input onChange={onChangeHandler} name="conpass" type="password" placeholder="Confirm Password..." required />
            </div>
            <div className="flex">
              <select onChange={onChangeHandler} name="department" value={data.department} required>
                <option value="">Select Department...</option>
                <option value="CSE">CSE</option>
                <option value="DS">DS</option>
                <option value="AI/ML">AI/ML</option>
              </select>
              <select onChange={onChangeHandler} name="gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex">
              <select onChange={onChangeHandler} name="domain" value={data.domain} required>
                <option value="">Select Domain...</option>
                <option value="Java">Java</option>
                <option value="C/C++">C/C++</option>
                <option value="Python">Python</option>
                <option value="Javascript">Javascript</option>
              </select>
              <select onChange={onChangeHandler} name="college" value={data.college} required>
                <option value="">Select College...</option>
                <option value="Dypcet">Dypcet</option>
              </select>
            </div>
            <input className="submit" type="submit" />
          </>
        ) : (
          <>
            <div className="loginform">
              <h2>LOGIN</h2>
              <input onChange={onChangeHandler} name="email" type="email" placeholder="Email..." required />
              <input onChange={onChangeHandler} name="password" type="password" placeholder="Password..." required />
              
              
              <select className="user-admin" onChange={(e) => setRole(e.target.value)} name="role" value={role} required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              
              <input className="submit" type="submit" />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Registration;
