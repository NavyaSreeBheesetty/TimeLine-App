import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts'; 
import ExpenseChart from './ExpenseChart';
import _ from 'lodash';
import Cookies from "universal-cookie";

const ExpenseTracker = () => {

     const [selectedExpenseDate,setSelectedExpenseDate]=useState(''); 

     const [expense,setExpense]=useState(''); 

const cookie=new Cookies();
     const user=cookie.get("username");
     console.log(user)


//for expenses

   useEffect(() => {
    axios.get('http://192.168.1.7:2805/expenses')
        .then(response => {

           let filteredUsers=response.data.filter((item) => item.user === user);
          console.log(filteredUsers)
            const sortedDate = filteredUsers.sort((a, b) => new Date(a.date) - new Date(b.date));
           const groupedDate = _.groupBy(sortedDate, 'date');
            const data = Object.keys(groupedDate).map(date => ({
                 date,
                 expense: groupedDate[date].length
             }));
             setExpense(data);
         })
      .catch(error => console.error(error));
 }, []);





  const handleExpenseBarClick=(e)=>{
    setSelectedExpenseDate(e.date);
   }


   if (selectedExpenseDate) {
       return <ExpenseChart date={selectedExpenseDate} />;
   }

   const data = [...expense];


    return (
    <>
      {/* <p className='expense'> Expense Tracker TimeLine</p> */}
      <center>
        <BarChart className='expenseTracker' width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 75, bottom: 5 }}>
            <XAxis dataKey="date"  style={{fontSize:"110%"}}/>
            <YAxis  style={{fontSize:"110%"}}/>
            <Tooltip cursor={{fill: 'transparent'}}/>
            {/* <Tooltip /> */}
            <Legend />
            <Bar dataKey="expense" fill="rgb(48, 81, 138)" onClick={handleExpenseBarClick} barSize={40} />

</BarChart>
</center>
</>
);

};
export default  ExpenseTracker;