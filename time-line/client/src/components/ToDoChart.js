import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import TimeChart from './TimeChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import { Segment } from 'semantic-ui-react';
import Cookies from "universal-cookie";



const TaskChart = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');  
     const cookie=new Cookies();
     const user=cookie.get("username");
     console.log(user)

//for to do  

    useEffect(() => {
      // axios.get('http://192.168.1.7:2805/tasks')
      axios.get('http://localhost:2805/tasks')
          .then(response => {

           let filteredUser=response.data.filter((item) => item.user === user);
           console.log(filteredUser)

              const sortedDates = filteredUser.sort((a, b) => new Date(a.date) - new Date(b.date));
              const groupedDates = _.groupBy(sortedDates, 'date');
              const data = Object.keys(groupedDates).map(date => ({
                  date,
                  tasks: groupedDates[date].length
              }));
              setTasks(data);
          })
          .catch(error => console.error(error));
  }, []);



// for To Do

    const handleBarClick = (e) => {
     setSelectedDate(e.date);
       
   };

   
  if (selectedDate) {
    return <TimeChart date={selectedDate} />;
}

  const data=[...tasks];
 
 return (
      <center>
       
         {/* <p className='todo'> TO DO  of {user}</p> */}
        <BarChart className='todoChart' width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 95, bottom: 5 }}>
            <XAxis dataKey="date" axisLine={{ stroke: 'black' }} tickLine={{ stroke: 'black' }}/>
            <YAxis />
            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="tasks" fill="rgb(48,31,138)" onClick={handleBarClick} barSize={40} />
            
</BarChart>
</center>
);
};

export default TaskChart;