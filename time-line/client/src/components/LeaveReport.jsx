import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts'; 
import { Button, Modal,Icon,Label} from "semantic-ui-react";
import LeaveChart from './LeaveChart';
import LeaveDateChart from './LeaveDateChart';
import _ from 'lodash';
import Cookies from "universal-cookie";


const LeaveReport = () => {

     const [selectedLeaveDate,setSelectedLeaveDate]=useState(''); 
     const [leave,setLeave]=useState(''); 
     const [searchDate, setSearchDate] = useState('');
     const [open, setOpen] = useState(false);
     const [sd,setSD]=useState('');

     const cookie=new Cookies();
     const user=cookie.get("username");
     const isAdmin = cookie.get("admin") === "true" ? true : false;
     console.log(isAdmin)

  useEffect(() => {
    axios.get('http://192.168.1.7:2805/leaves')
        .then(response => {


if(isAdmin==true){


 const sortedDate = response.data.sort((a, b) => new Date(a.stdt) - new Date(b.stdt));
           const groupedDate = _.groupBy(sortedDate, 'stdt');
            const data = Object.keys(groupedDate).map(stdt => ({
                 stdt,
                 leave: groupedDate[stdt].length
             }));
             setLeave(data);
            }
            else{
              let filteredUser=response.data.filter((item) => item.username === user);
              const sortedDate = filteredUser.sort((a, b) => new Date(a.stdt) - new Date(b.stdt));
              const groupedDate = _.groupBy(sortedDate, 'stdt');
              const data = Object.keys(groupedDate).map(stdt => ({
                 stdt,
                 leave: groupedDate[stdt].length
             }));
             setLeave(data);
            }
      })
      .catch(error => console.error(error));
 }, []);  
 
 

 const handleLeaveBarClick=(e)=>{
    setSelectedLeaveDate(e.stdt);
   }

if (selectedLeaveDate) {
       return <LeaveChart stdt={selectedLeaveDate} />;
   }


   const handleSearchInputChange = (e) => {
    const searchedDates=e.target.value;
    
      setSearchDate(searchedDates);
    };
    
    if(searchDate){
      return < LeaveDateChart stdt={searchDate}/>;
    }
   

   const data=[...leave];



 const yAxisTicks = data.map(({leave}) => {
    return Number.isInteger(leave) ? leave : null;
  }).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length - 1);
  
  if (!yAxisTicks.includes(0)) {
    yAxisTicks.push(0);
  }


  const yAxisTickFormatter = (leave) => {
    if (Number.isInteger(leave)) {
      return leave;
    } else {
      return '';
    }
  };

  return (
<div className='leaveBg'>

    <center>
       <BarChart className='leaveReport' width={800} height={450} data={data} margin={{ top: 120, right: 50, left: 75, bottom: 5 }}>
            <XAxis dataKey="stdt"  style={{fontSize:"110%"}}>
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
  </XAxis>
            <YAxis style={{fontSize:"130%"}} ticks={yAxisTicks} tickFormatter={yAxisTickFormatter} label={{ value: 'leaves', angle: -90, position: 'insideLeft', fontSize: "130%" }} />
            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="leave" fill="rgb(82, 129, 183)" onClick={handleLeaveBarClick} barSize={40}  cursor="pointer" />

</BarChart>
</center>




<div class="ui icon input" id="search">
  <input class="prompt" type="date" placeholder="Search" onChange={(e)=>{setSD(e.target.value)}}/>  
  <div class="ui icon">
    <Button icon onClick={()=>{handleSearchInputChange(sd)}}>
      <Icon name='search' className='icon' />
    </Button>
  </div>
</div>

</div>
  )
}

export default LeaveReport
