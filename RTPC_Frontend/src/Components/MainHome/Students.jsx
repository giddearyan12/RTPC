import React, { useEffect, useState } from 'react'
import './Students.css'
import axios from 'axios'

const Students = () => {
  const url ='http://localhost:3000'
  const [studentList, setstudentList] = useState([]);
  const fetchData = async()=>{
    try
    {const newUrl = url+'/students';
    const response = await axios.get(newUrl);
    setstudentList(response.data.students);}
    catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
  fetchData();
  }, [])
  
  return (
    <div className='student-section'>
    <h2>Proyecta Minds Members </h2>
    <div className='students-list'>
      
      {studentList.map((list, index)=>{
        return (
          <div className='student-card' key={index}>
          <h4>{list.name}</h4>
          <p>{list.domain}</p>
          </div>
        )
      })}
    </div>
    </div>
  )
}

export default Students
