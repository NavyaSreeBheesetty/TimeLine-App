import React,{useState} from 'react'
import {BarChart, Bar, XAxis, YAxis,Tooltip, Label,Legend } from 'recharts';

import TimeChart from './TimeChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import "./style.css";


export default function BarChartComponent ({data}) {
  const[selectedDate,setSelectedDate]=useState('');

  const yAxisTickFormatter = (tasks) => {
    if (Number.isInteger(tasks)) {
      return tasks;
    } else {
      return '';
    }
  };

  const handleBarClick = (e) => {
    setSelectedDate(e.date);   
  };

 if (selectedDate) {
   return <TimeChart date={selectedDate} />;
}

  return (
    
      <div className='todoReport'>
      <center>
       
        <BarChart className='todoChart' width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 95, bottom: 5 }}>
            <XAxis dataKey="date" axisLine={{ stroke: 'black' }} tickLine={{ stroke: 'black' }} style={{fontSize:"130%"}} >
            
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
  </XAxis>
            <YAxis style={{fontSize:"130%"}}  tickFormatter={yAxisTickFormatter}  label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }}/>
            <Tooltip cursor={{fill: 'transparent'}}/> 
            <Bar dataKey="tasks" fill="rgb(82, 129, 183)" onClick={handleBarClick} barSize={40}  cursor="pointer" />
            
</BarChart>
</center>

    </div>
  )
}

