import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import ExpenseChart from './ExpenseChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import { Button,Icon,Modal } from "semantic-ui-react";
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import "./style.css"; 
import ExpenseTracker from './ExpenseTracker';


const ExpenseDateChart = (date) => {
    const cookie = new Cookies();
    const user = cookie.get("username");

    
const [expense,setExpense]=useState([]);
const [selectedDate, setSelectedDate] = useState(''); 
const [temp, setTemp] = useState(false);
const [open, setOpen] = useState(false);
const navigate = useNavigate();



useEffect(() => {
    axios.get('http://192.168.1.7:2805/expenses')
 
        .then(response => {


            const filteredName = response.data.filter((item) => item.user === user);
            const filteredData = filteredName.filter(
              (item) => item.date === date.date);
          

              const data = filteredData.reduce((acc, curr) => {
                const { date, expense} = curr;
                if (acc[date]) {
                  acc[date].expense.push(expense);
                } else {
                  acc[date] = { date, expense: [expense] };
                }
                return acc;
              }, {});
              
              const expenseData = Object.values(data).map((item) => ({
                date: item.date,
                expense: item.expense.length
              }));
              
            
              
              setExpense(expenseData);
              
                  
                })
                
                .catch(error => console.error(error));
        }, []);
        
        
        
        const handleBarClick = (e) => {
            setSelectedDate(e.date);
              
          };
        
        
        
          const handleClick = () => {
            setTemp(true);
            return <ExpenseTracker />;
          };
        
           
          if (selectedDate) {
            return <ExpenseChart date={selectedDate} />;
        
          } 


          const data = [...expense];




          if (data.length === 0) {
            return (
              // <Modal open={open} onClose={()=>setOpen(false)}>
              <Modal open   style={{
                width: "400px",
                height: "150px",
                margin: "auto",
                marginTop: "50px",
                backgroundColor: "white",
                color: "black",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              }}>
                
                <Modal.Content>
                  <p>No activities reported</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={() => setOpen(false)}
                    style={{ backgroundColor: "rgb(82, 129, 183)" }}
                  >
                    Close
                  </Button>
                </Modal.Actions>
              </Modal>
            );
          }



          const yAxisTickFormatter = (expense) => {
            if (Number.isInteger(expense)) {
              return expense;
            } else {
              return '';
            }
          };
        
         
        
          const yAxisTicks = data.map(({expense}) => {
            return Number.isInteger(expense) ? expense : null;
          }).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length - 1);
          
          if (!yAxisTicks.includes(0)) {
            yAxisTicks.push(0);
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
            
                        {/* <YAxis style={{fontSize:"130%"}}/> */}
            
                        <Tooltip cursor={{fill: 'transparent'}}/>
                        <Legend />
                        <Bar dataKey="expense" fill="rgb(82, 129, 183)" onClick={handleBarClick} barSize={40} />
                        
            </BarChart>
            </center>
            </div>
            
            
            
            </> }
            
                  {temp && <ExpenseTracker/>}
            </>
            
            
            
              );


}
export default ExpenseDateChart;