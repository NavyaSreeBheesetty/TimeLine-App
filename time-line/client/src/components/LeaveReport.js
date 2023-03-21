import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts'; 
import LeaveChart from './LeaveChart';
import _ from 'lodash';
import Cookies from "universal-cookie";


const LeaveReport = () => {

const [selectedLeaveDate,setSelectedLeaveDate]=useState(''); 

     const [leave,setLeave]=useState(''); 

     const cookie=new Cookies();
     const user=cookie.get("username");


  useEffect(() => {
    axios.get('http://192.168.1.7:2805/leaves')
        .then(response => {
let filteredUser=response.data.filter((item) => item.username === user);
console.log(filteredUser)
 const sortedDate = filteredUser.sort((a, b) => new Date(a.stdt) - new Date(b.stdt));
           const groupedDate = _.groupBy(sortedDate, 'stdt');
            const data = Object.keys(groupedDate).map(stdt => ({
                 stdt,
                 leave: groupedDate[stdt].length
             }));
             setLeave(data);
      })
      .catch(error => console.error(error));
 }, []);  
 
 

 const handleExpenseBarClick=(e)=>{
    setSelectedLeaveDate(e.stdt);
   }

if (selectedLeaveDate) {
       return <LeaveChart stdt={selectedLeaveDate} />;
   }

   const data=[...leave];

  return (
    <center>
       

        <BarChart className='leaveReport' width={800} height={450} data={data} margin={{ top: 120, right: 50, left: 75, bottom: 5 }}>
            <XAxis dataKey="stdt" />
            <YAxis />
            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="leave" fill="rgb(47, 225, 225)" onClick={handleExpenseBarClick} barSize={40} />

</BarChart>
</center>
  )
}

export default LeaveReport
