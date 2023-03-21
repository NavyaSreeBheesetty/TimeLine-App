import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table } from "semantic-ui-react";
import "./style.css"; 
import Cookies from "universal-cookie";
import moment from 'moment';
moment().format();


const ExpenseChart=(date)=>{


 const [data, setData] = useState([]);
 const [selectedBar, setSelectedBar] = useState(null);

 const cookie=new Cookies();
     const user=cookie.get("username");
     console.log(user)

useEffect(() => {
       

            axios.get(`http://192.168.1.7:2805/expenses`)

            .then(response => {

              let filteredNames=response.data.filter((item) => item.user === user);
              console.log(filteredNames)

                  let filteredData=(filteredNames.filter(item => item.date===date.date ))    
                  console.log(filteredData)  
                
                 setData(filteredData);

                  })
            .catch(error => console.error(error));
    }, []);




    const getChartData = (data) => {
        const expense = data.filter(item => item.type === 'expense').length;
        const savings = data.filter(item => item.type === 'savings').length;
        const chartData = [
          { name: 'expense', value: expense },
          { name: 'savings', value: savings }
        ];
        return chartData;
      }
    
      // const handleClick = (data, index) => {
      //   setSelectedBar(index);
      // }


      const handleClick = (e) => {
        const clickedLabel = e.activeLabel;
        console.log(clickedLabel);
        setSelectedBar(clickedLabel);
      
      }
      
      

     
      const renderChart = () => {
        const chartData = getChartData(data);
        return (
            <center>
          <BarChart className='expenseChart' width={600} height={300} margin={{ top: 55, right: 50, left: 50, bottom: 5 }} data={chartData} barSize={8} value={data.filter(item => item.type)} onClick={handleClick}>
            <XAxis dataKey="name" label={{ fontSize: 24, fontFamily: "italic" }} />
            <YAxis />
            <Tooltip cursor={{fill: 'transparent'}}/>
            {/* <Tooltip /> */}
            <Legend />
            <Bar dataKey="value" fill="rgb(47, 225, 225)" barSize={40} />
          </BarChart>
          </center>
        );
      }
    
      const renderTable = () => {
      

        
        // if (selectedBar !== null) {
        //   const type = selectedBar ? 'savings' : 'expense';

        if (selectedBar !==null){
          const tableData = data.filter(item => item.type === selectedBar);
          console.log(tableData);
          return (
            <Table className="my-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.map(item => (
                  <Table.Row key={item._id}>
                    <Table.Cell>{item.names}</Table.Cell>
                    <Table.Cell>{item.amount}</Table.Cell>
                    <Table.Cell>{item.date}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          );
        }
      }
    
      

      return (
        <div>
          {renderChart()}
          {renderTable()}
        </div>
      );


}

export default ExpenseChart;



