import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import BugsChart from './BugsChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import { Button,Icon,Modal } from "semantic-ui-react";
import Cookies from "universal-cookie";
import "./style.css"; 
import BugReport from './BugReport';


const BugDateChart = (date) => {
   
  const cookie = new Cookies();
const [bugs,setBugs]=useState([]);
const [selectedDate, setSelectedDate] = useState(''); 
const [temp, setTemp] = useState(false);
const [open, setOpen] = useState(false);

useEffect(() => {
    // axios.get('http://192.168.1.7:2805/bugs')
    axios
    .get("http://192.168.1.7:2805/bugs/" + cookie.get("username"))

        .then(response => {

            const filteredData = response.data.filter(
              (item) => item.date === date.date);
   


      const data = filteredData.reduce((acc, curr) => {
        const { date, bugs } = curr;
        if (acc[date]) {
          acc[date].bugs.push(bugs);
        } else {
          acc[date] = { date, bugs: [bugs] };
        }
        return acc;
      }, {});
      
      const bugsData = Object.values(data).map((item) => ({
        date: item.date,
        bugs: item.bugs.length
      }));
      
      console.log(bugsData);
      
      setBugs(bugsData);
      
          
        })
        
        .catch(error => console.error(error));
}, []);

const handleBarClick = (e) => {
    setSelectedDate(e.date);
      
  };

  const handleClick = () => {
    setTemp(true);
    return <BugReport />;
  };

   
  if (selectedDate) {
    return <BugsChart date={selectedDate} />;

  }
  

const data=[...bugs];



const yAxisTickFormatter = (bugs) => {
  if (Number.isInteger(bugs)) {
    return bugs;
  } else {
    return '';
  }
};



const yAxisTicks = data.map(({bugs}) => {
  return Number.isInteger(bugs) ? bugs : null;
}).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length - 1);

if (!yAxisTicks.includes(0)) {
  yAxisTicks.push(0);
}


if (data.length === 0) {
    return (
      <Modal open={open} onClose={()=>setOpen(false)}>
        <Modal.Content>
            <p>NO activities reported</p>
          </Modal.Content>
          <Modal.Actions>
          <Button onClick={() => setOpen(false)} style={{backgroundColor:"rgb(82, 129, 183)"}}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }




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
            <XAxis dataKey="date" axisLine={{ stroke: 'black' }} tickLine={{ stroke: 'black' }} style={{fontSize:"130%"}}/>
            <YAxis style={{fontSize:"130%"}} ticks={yAxisTicks} tickFormatter={yAxisTickFormatter}/>

            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="bugs" fill="rgb(82, 129, 183)" onClick={handleBarClick} barSize={40} />
            
</BarChart>
</center>
</div>



</> }

      {temp && <BugReport />}
</>



  );
}

export default BugDateChart;
