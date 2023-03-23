import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table } from "semantic-ui-react";
import "./style.css"; 
import Cookies from "universal-cookie";


const LeaveChart = (stdt) => {

     const [data, setData] = useState([]);
 const [selectedBar, setSelectedBar] = useState(null);
 const [reason, setReason] = useState([]);
 const [open, setOpen] = useState(false);

 const cookie = new Cookies();
 const user = cookie.get("username");

useEffect(() => {
       

            axios.get(`http://192.168.1.7:2805/leaves`)

            .then(response => {

              let filteredName = response.data.filter((item) => item.username === user);
                let filteredData=(filteredName.filter(item => item.stdt===stdt.stdt ))    
                 
              
               setData(filteredData);


     })
            .catch(error => console.error(error));
    }, []);  
    
    
    const getChartData = (data) => {
        const casualLeave = data.filter(item => item.type === 'Casual Leave').length;
        const sickLeave = data.filter(item => item.type === 'Sick Leave').length;
        const emergencyLeave = data.filter(item => item.type === 'Emergency Leave').length;
        const chartData = [
          { name: 'Casual Leave', value: casualLeave },
          { name: 'Sick Leave', value: sickLeave },
          { name: 'Emergency Leave', value: emergencyLeave }
        ];
        return chartData;
      }

      const handleClick = (e) => {
        const clickedLabel = e.activeLabel;
        console.log(clickedLabel);
        setSelectedBar(clickedLabel);
      
      }


      function handleButtonClick(reason) {
       
        setReason(reason);
        setOpen(true);
      }
   

    
      const renderChart = () => {
        const chartData = getChartData(data);
        return (
            <center>
          <BarChart className='leaveChart' width={600} height={300} data={chartData}  value={data.filter(item => item.type)} margin={{ top: 55, right: 50, left: 50, bottom: 5 }} onClick={handleClick}>
            <XAxis dataKey="name"  style={{fontSize:"110%"}}/>
            <YAxis  style={{fontSize:"110%"}} />
            <Tooltip cursor={{fill: 'transparent'}}/>
            {/* <Tooltip /> */}
            <Legend />
            <Bar dataKey="value" fill="#8884d8" barSize={40} />
          </BarChart>
          </center>
        );
      }




      const renderTable = () => {
        if (selectedBar !==null){
          const tableData = data.filter(item => item.type === selectedBar);
     
          return (
            <Table className="my-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>StartDate</Table.HeaderCell>
                  <Table.HeaderCell>EndDate</Table.HeaderCell>
                   <Table.HeaderCell>Reason</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.map(item => (
                  <Table.Row key={item._id}>
                    <Table.Cell>{item.username}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.stdt}</Table.Cell>
                    <Table.Cell>{item.enddt}</Table.Cell>
                    <Table.Cell>
                  <Button onClick={() => handleButtonClick(item.reason)}>
                    View
                  </Button>
                </Table.Cell>
            </Table.Row>
                ))}
              </Table.Body>
            </Table>
          );
        }


 <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Reason</Modal.Header>
        <Modal.Content>
          <p>{reason}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>


      }



  return (
    <div>
      
      {renderChart()}
          {renderTable()}
    </div>
  )
}

export default LeaveChart
