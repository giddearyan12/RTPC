import React, { useState } from "react";
import "./Registration.css";
import rocket from "../assets/rocket.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./MainHome/Chat/Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const Registration = () => {
  const url = "http://localhost:5000";
  const [token, setToken] = useState("");
  const [curr, setCurr] = useState("Register");
  const { setAuthUser } = useAuthContext();
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

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onNameInput = (event) => {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z ]*$/;

    if (nameRegex.test(value)) {
      setData((data) => ({ ...data, name: value }));
    }
  };

  const navigate = useNavigate();

  const onLogin = async (event) => {
    event.preventDefault();

    let newUrl = url;
    if (curr === "Login") {
      newUrl += "/user/login";
    } else {
      newUrl += "/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.data.token);

        localStorage.setItem("chat-user", JSON.stringify(response.data.data));
        setAuthUser(data);

        navigate("/home");
        toast.success("Login successfull");
        console.log("Success");
      } else {
        console.log(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.log("An error occurred. Please try again.", error);
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
              <input
                onInput={onNameInput}
                value={data.name}
                name="name"
                type="text"
                placeholder="Name..."
                required
              />
              <input
                onChange={onChangeHandler}
                name="email"
                type="email"
                placeholder="Email..."
                required
              />
            </div>
            <div className="flex">
              <input
                onChange={onChangeHandler}
                name="phone"
                type="number"
                placeholder="Phone..."
                maxLength="10"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
                required
              />
              <input
                onChange={onChangeHandler}
                name="en"
                type="text"
                placeholder="EN no..."
                required
              />
            </div>
            <div className="flex">
              <input
                onChange={onChangeHandler}
                name="password"
                type="password"
                placeholder="Password..."
                required
              />
              <input
                onChange={onChangeHandler}
                name="conpass"
                type="password"
                placeholder="Confirm Password..."
                required
              />
            </div>
            <div className="flex">
              <select
                onChange={onChangeHandler}
                name="department"
                value={data.department}
                required
              >
                <option value="">Select Department...</option>
                <option value="CSE">CSE</option>
                <option value="DS">DS</option>
                <option value="AL/ML">AI/ML</option>
              </select>
              <div className="flex">
                <select onChange={onChangeHandler} name="gender" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="flex">
              <select
                onChange={onChangeHandler}
                name="domain"
                value={data.domain}
                required
              >
                <option value="">Select Domain...</option>
                <option value="Java">Java</option>
                <option value="C/C++">C/C++</option>
                <option value="Python">Python</option>
                <option value="Javascript">Javascript</option>
              </select>
              <select
                onChange={onChangeHandler}
                name="college"
                value={data.college}
                required
              >
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
              <input
                onChange={onChangeHandler}
                name="email"
                type="email"
                placeholder="Email..."
                required
              />
              <input
                onChange={onChangeHandler}
                name="password"
                type="password"
                placeholder="Password..."
                required
              />
              <input className="submit" type="submit" />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Registration;
