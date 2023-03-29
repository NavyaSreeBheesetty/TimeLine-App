import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip,Label, Legend } from 'recharts'; 
import ExpenseChart from './ExpenseChart';
import ExpenseDateChart from './ExpenseDateChart';
import _ from 'lodash';
import { Button, Modal,Icon} from "semantic-ui-react";
import Cookies from "universal-cookie";

const ExpenseTracker = () => {

     const [selectedExpenseDate,setSelectedExpenseDate]=useState(''); 
     const [searchDate, setSearchDate] = useState('');
     const [tasks,setTasks]=useState(''); 
     const [open, setOpen] = useState(false);
     const [sd,setSD]=useState('')

     const cookie = new Cookies();
     const user = cookie.get("username");
     const isAdmin = cookie.get("admin") === "true" ? true : false;
     console.log(isAdmin)


//for expenses

   useEffect(() => {
    axios.get('http://192.168.1.7:2805/expenses')

    // axios.get('http://localhost:2805/expenses')
        .then(response => {
          if(isAdmin==true){

          
            const sortedDate = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
           const groupedDate = _.groupBy(sortedDate, 'date');
            const data = Object.keys(groupedDate).map(date => ({
                 date,
                 tasks: groupedDate[date].length
             }));
             setTasks(data);
            }
            else{
              
           let filteredUsers=response.data.filter((item) => item.user === user);
           console.log(filteredUsers)
             const sortedDate = filteredUsers.sort((a, b) => new Date(a.date) - new Date(b.date));
            const groupedDate = _.groupBy(sortedDate, 'date');
             const data = Object.keys(groupedDate).map(date => ({
                  date,
                  tasks: groupedDate[date].length
              }));
              setTasks(data);
            }
         })
      .catch(error => console.error(error));
 }, []);





  const handleExpenseBarClick=(e)=>{
    setSelectedExpenseDate(e.date);
   }


   if (selectedExpenseDate) {
       return <ExpenseChart date={selectedExpenseDate} />;
   }




  //  const handleSearchInputChange = (e) => {
  //   const searchedDates=e.target.value;
    
  //     setSearchDate(searchedDates);
  //   };
    
  //   if(searchDate){
  //     return < ExpenseDateChart date={searchDate}/>;
  //   }

   const data = [...tasks];


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
    {/* <div className='expenseBg'>
     
      <center>
        <BarChart className='expenseTracker' width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 35, bottom: 5 }}>
            <XAxis dataKey="date"  style={{fontSize:"110%"}}>
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
            </XAxis>
            <YAxis style={{fontSize:"130%"}}    label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }} />
            <Tooltip cursor={{fill: 'transparent'}}/>
            
            <Bar dataKey="tasks"  fill="rgb(48, 81, 138)" onClick={handleExpenseBarClick} barSize={40}  cursor="pointer"/>
            
</BarChart>
</center>


</div> */}


</>
);

};
export default  ExpenseTracker;