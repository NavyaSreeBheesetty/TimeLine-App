import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table } from "semantic-ui-react";
import "./style.css"; 
import moment from 'moment';
moment().format();

const ExpenseChart=(date)=>{


 const [data, setData] = useState([]);
 const [selectedBar, setSelectedBar] = useState(null);

const [open, setOpen] = useState(false);


useEffect(() => {
       

            axios.get(`http://localhost:2805/expenses`)

            .then(response => {

                  let filteredData=((response.data).filter(item => item.date===date.date ))    
                  console.log(filteredData)  
                
                 setData(filteredData);

                  })
            .catch(error => console.error(error));
    }, []);




    const getChartData = (data) => {
        const expense = data.filter(item => item.type === 'expense').length;
        const savings = data.filter(item => item.type === 'savings').length;
        const chartData = [
          { name: 'Expense', value: expense },
          { name: 'Savings', value: savings }
        ];
        return chartData;
      }
    
      const handleClick = (data, index) => {
        setSelectedBar(index);
      }
     
      const renderChart = () => {
        const chartData = getChartData(data);
        return (
            <center>
          <BarChart width={600} height={300} data={chartData} barSize={8} onClick={handleClick}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" barSize={25} />
          </BarChart>
          </center>
        );
      }
    
      const renderTable = () => {
        if (selectedBar !== null) {
          const type = selectedBar === 0 ? 'expense' : 'savings';
          const tableData = data.filter(item => item.type === type);
          return (
            <Table>
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



