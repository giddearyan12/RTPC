import React, { useEffect, useState } from 'react'
import './Registration.css'
import rocket from '../assets/rocket.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Registration = () => {
  const url = "http://localhost:3000";
  const [token, setToken] = useState("")
  const [curr, setcurr] = useState('Register')
  
  const [data, setData] = useState({
    name:"",
    email:"",
    phone:"",
    en:"",
    password:"",
    department:"",
    gender:"",
    college:"",
    domain:""

  });
  const validateForm = () => {
   

    if (curr === 'Register') {
      if (!data.name) alert('Name is required');
      if (!data.email) alert('Email is required');
      if (!data.phone) alert('Phone number is required');
      if (!data.password) alert('Password is required');
      if (data.password !== data.confirmPassword) {
        // alert('Passwords do not match');
      }
      if (!data.department) alert('Department is required');
    }

    if (!data.email) alert('Email is required');
    if (!data.password) alert('Password is required');

    
  };


  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data, [name]:value}))
  }
  const navigate = useNavigate();

  const onLogin= async(event)=>{
    event.preventDefault();
    validateForm();

    let newUrl = url;
    if(curr==='Login'){
      newUrl+='/user/login'
    }
    else{
       newUrl+='/user/register'
    }

    const response = await axios.post(newUrl, data);
    if(response.data.success){
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/home');

      console.log('Success')
    }
    else{
      alert(response.data.message)
      console.log("error re bhava");
      
    }

   

    
  }
  const showLogin =()=>{
    curr==="Register"?setcurr('Login'):setcurr('Register');
  }

  return (
    <div>
      <div className="reg-page">
        <div className="reg-welcome">
            <img src={rocket} alt="" />
            <h2>Welcome</h2>
            <p>PROYECTA MINDS</p>
            <button onClick={showLogin}>{curr==="Register"?"Login":"Register"}</button>
        </div>
        <form onSubmit={onLogin} action='' className="reg-form">
            
            { curr==='Register'?<>
              <h2>REGISTRATION</h2>
            <div className='flex'>
              <input onChange={onChangeHandler} name='name' type="text" placeholder='Name...'/>
              <input onChange={onChangeHandler} name='email' type="email" placeholder='Email..' />
            </div>
            <div className='flex'>
              <input onChange={onChangeHandler} name='phone' type="text" placeholder='Phone...'/>
              <input onChange={onChangeHandler} name='en' type="text" placeholder='EN no...' />
            </div>
            <div className='flex'>
              <input onChange={onChangeHandler} name='password' type="password" placeholder='Password...'/>
              <input onChange={onChangeHandler} name='conpass' type="password" placeholder='Confirm Password...' />
            </div>
            <div className='flex'>
            <input onChange={onChangeHandler} name='department' type="text" placeholder='Department...' />
            <div className='flex'>
            <input onChange={onChangeHandler} type="radio" name='gender' value='Male'/>Male
            <input onChange={onChangeHandler} type="radio" name='gender' value='Female'/>Female
            </div>
            
              
            </div>
            <div className='flex'>
              <input onChange={onChangeHandler} name='college' type="text" placeholder='College Name...'/>
              <input onChange={onChangeHandler} name='domain' type="text" placeholder='Domain...' />
            </div>
            <input className='submit' type="submit" />
            </>:
            <>
            <div className="loginform">
              <h2>LOGIN</h2>
            <input onChange={onChangeHandler} name='email' type="email" placeholder='Email...'/>
            <input onChange={onChangeHandler} name='password' type="password" placeholder='Password..' />
            <input className='submit' type="submit" />
            </div>
            </>
            }
        </form>
      </div>
    </div>
  )
}

export default Registration
