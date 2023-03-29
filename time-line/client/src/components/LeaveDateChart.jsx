import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import LeaveChart from './LeaveChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import { Button,Icon,Modal } from "semantic-ui-react";
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import "./style.css"; 
import LeaveReport from './LeaveReport';

const LeaveDateChart = (stdt) => {

  const cookie = new Cookies();
  const user = cookie.get("username");
  const isAdmin = cookie.get("admin") === "true" ? true : false;
  console.log(isAdmin)


    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedLeaveDate,setSelectedLeaveDate]=useState(''); 
    const [leave,setLeave]=useState('');


    const [temp, setTemp] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();



    console.log(stdt)

    useEffect(() => {
        axios.get('http://192.168.1.7:2805/leaves')
     
            .then(response => {
    
    
                const filteredName = response.data.filter((item) => item.user === user);
                const filteredData = filteredName.filter(
                  (item) => item.stdt === stdt.stdt);
              
    
                  const data = filteredData.reduce((acc, curr) => {
                    const { stdt, leave} = curr;
                    if (acc[stdt]) {
                      acc[stdt].leave.push(leave);
                    } else {
                      acc[stdt] = { stdt, leave: [leave] };
                    }
                    return acc;
                  }, {});
                  
                  const leaveData = Object.values(data).map((item) => ({
                    stdt: item.stdt,
                    leave: item.leave.length
                  }));
                  
                  setLeave(leaveData);
                     
                    })
                    
                    .catch(error => console.error(error));
            }, []);

            const handleBarClick = (e) => {
                setSelectedDate(e.stdt);
                  
              };
            
        
               
              if (selectedDate) {
                return <LeaveChart stdt={selectedDate} />;
            
              } 


              const handleClick = () => {
                setTemp(true);
                return <LeaveReport />;
              };
            
    
    
              const data = [...leave];




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
   

    <>
            
    {!temp && <> <div className="dateChartButton">
            
            <Button icon labelPosition='right' class="ui button" onClick={handleClick}>
          <Icon name='left arrow' />Previous
        </Button>
            
          </div>
    
      <div style={{display:"flex"}} >
          <center>
           
            <BarChart className='todoChart' width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 95, bottom: 5 }}>
                <XAxis dataKey="stdt" axisLine={{ stroke: 'black' }} tickLine={{ stroke: 'black' }} style={{fontSize:"130%"}}/>
                <YAxis style={{fontSize:"130%"}} ticks={yAxisTicks} tickFormatter={yAxisTickFormatter}/>
    
                {/* <YAxis style={{fontSize:"130%"}}/> */}
    
                <Tooltip cursor={{fill: 'transparent'}}/>
                <Legend />
                <Bar dataKey="leave" fill="rgb(82, 129, 183)" onClick={handleBarClick} barSize={40} />
                
    </BarChart>
    </center>
    </div>
    
    
    
    </> }
    
          {temp && <LeaveReport/>}
    </>


  )
}

export default LeaveDateChart
