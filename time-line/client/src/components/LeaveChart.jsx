import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Label,Table,Icon} from "semantic-ui-react";
import "./style.css"; 
import Pagination from 'react-js-pagination';
import Cookies from "universal-cookie";
import BugReport from './BugReport';
import LeaveReport from './LeaveReport';


const LeaveChart = (stdt) => {

     const [data, setData] = useState([]);
 const [selectedBar, setSelectedBar] = useState([]);
 const [reason, setReason] = useState([]);
 const [open, setOpen] = useState(false);
 const [temp, setTemp] = useState(false);

 const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage, setItemsPerPage] = useState(2);

 const cookie = new Cookies();
 const user = cookie.get("username");
 const isAdmin = cookie.get("admin") === "true" ? true : false;
 console.log(isAdmin)

useEffect(() => {
       

            axios.get(`http://192.168.1.7:2805/leaves`)

            .then(response => {
              if(isAdmin==true){

              
                let filteredData=response.data.filter(item => item.stdt===stdt.stdt )    
                 
              
               setData(filteredData);
            }
            else{
              let filteredName = response.data.filter((item) => item.username === user);
              let filteredData=(filteredName.filter(item => item.stdt===stdt.stdt ))    
               
            
             setData(filteredData);
            }


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
   
      const handlePreviousClick = () => {
       
        setTemp(true);
    
        return <LeaveReport />;
      };


      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const tableData = data
        .filter(item => item.type === selectedBar)
        .slice(indexOfFirstItem, indexOfLastItem);





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



    
      const renderChart = () => {
        const chartData = getChartData(data);

        const yAxisTickFormatter = (chartData) => {
          if (Number.isInteger(chartData)) {
            return chartData;
          } else {
            return '';
          }
        };



        const yAxisTicks = data.map(({chartData}) => {
          return Number.isInteger(chartData) ? chartData : null;
        }).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length - 1);
        
        if (!yAxisTicks.includes(0)) {
          yAxisTicks.push(0);
        }



        return (

            <center>
            <BarChart className='leaveChart' width={600} height={300} data={chartData}  value={data.filter(item => item.type)} margin={{ top: 55, right: 50, left: 50, bottom: 5 }} onClick={handleClick}>
            <XAxis dataKey="name"  style={{fontSize:"130%"}}>
           
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
  </XAxis>
            <YAxis style={{fontSize:"130%"}} ticks={yAxisTicks} tickFormatter={yAxisTickFormatter} label={{ value: 'Leaves', angle: -90, position: 'insideLeft', fontSize: "130%" }}/>


            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="value" fill="rgb(82, 129, 183)" barSize={40}  cursor="pointer" />
          </BarChart>
          </center>

        );
      }




      const renderTable = () => {
        if (selectedBar.length!==0){
          const tableData = data.filter(item => item.type === selectedBar);
     
          return (
            <>
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

            {selectedBar.length!==0? (<> <Pagination
      activePage={currentPage}
      itemsCountPerPage={itemsPerPage}
      totalItemsCount={data.filter(item => item.type === selectedBar).length}
      pageRangeDisplayed={5}
      onChange={(page) => setCurrentPage(page)}
    /> </>):<></>}

</>
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


<>
    {!temp && <> <div className="timeChartButton">
    <Button icon labelPosition='right' class="ui button" onClick={handlePreviousClick}>
    <Icon name='left arrow' />Previous
    </Button>
        
     </div> 


    <div>
      
      {renderChart()}
          {renderTable()}
    </div>


    </> }

    {temp && <LeaveReport />}
    </>
  )
}

export default LeaveChart
