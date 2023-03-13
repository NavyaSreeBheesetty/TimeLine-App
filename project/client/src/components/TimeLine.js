import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ComposedChart,BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import TimeChart from './TimeChart';
import ExpenseChart from './ExpenseChart';
import _ from 'lodash';

const TaskChart = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');  
    
    const [selectedExpenseDate,setSelectedExpenseDate]=useState(''); 

    const [expense,setExpense]=useState('');  
    
    const user="navya";

//for to do  

    useEffect(() => {
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

//for expenses

  useEffect(() => {
    axios.get('http://localhost:2805/expenses')
        .then(response => {

          let filteredUsers=response.data.filter((item) => item.user === user);
          console.log(filteredUsers)
            const sortedDate = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            const groupedDate = _.groupBy(sortedDate, 'date');
            const data = Object.keys(groupedDate).map(date => ({
                date,
                expense: groupedDate[date].length
            }));
            setExpense(data);
        })
        .catch(error => console.error(error));
}, []);

//for To Do

    const handleBarClick = (e) => {
     setSelectedDate(e.date);
       
   };

   
  if (selectedDate) {
    return <TimeChart date={selectedDate} />;
}


//for expenses

   const handleExpenseBarClick=(e)=>{
    setSelectedExpenseDate(e.date);
   }


  if (selectedExpenseDate) {
      return <ExpenseChart date={selectedExpenseDate} />;
  }

  const data = [...tasks, ...expense];
 

 return (
      <center>
       

        <BarChart width={1000} height={600} data={data} margin={{ top: 55, right: 50, left: 50, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#8884d8" onClick={handleBarClick} />
            <Bar dataKey="expense" fill="#82ca9d" onClick={handleExpenseBarClick} />

</BarChart>
</center>
);
};

export default TaskChart;