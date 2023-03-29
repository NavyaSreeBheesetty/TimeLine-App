import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table,Icon,Label} from "semantic-ui-react";
import "./style.css"; 
import Pagination from 'react-js-pagination';


import Cookies from "universal-cookie";
import moment from 'moment';
import ExpenseTracker from './ExpenseTracker';
moment().format();


const ExpenseChart=(date)=>{


 const [data, setData] = useState([]);
 const [selectedBar, setSelectedBar] = useState([]);
 const [temp, setTemp] = useState(false);
 const [open, setOpen] = useState(false);

 const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(2);


const cookie = new Cookies();
const user = cookie.get("username");
const isAdmin = cookie.get("admin") === "true" ? true : false;
console.log(isAdmin)

useEffect(() => {
  axios.get('http://localhost:2805/expenses')

            // axios.get(`http://192.168.1.7:2805/expenses`)

            .then(response => {

              if(isAdmin==true){

             

                  let filteredData=(response.data.filter(item => item.date===date.date ))    
                  console.log(filteredData)  
                
                 setData(filteredData);
              }
              else{
                let filteredNames=response.data.filter((item) => item.user === user);
              console.log(filteredNames)

                  let filteredData=(filteredNames.filter(item => item.date===date.date ))    
                  console.log(filteredData)  
                
                 setData(filteredData);
              }
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


      const handleClick = (e) => {
        const clickedLabel = e.activeLabel;
        console.log(clickedLabel);
        setSelectedBar(clickedLabel);
      
      }
      
      const handlePreviousClick = () => {
       
        setTemp(true);
    
        return <ExpenseTracker />;
      };




      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const tableData = data
        .filter(item => item.type === selectedBar)
        .slice(indexOfFirstItem, indexOfLastItem);
      

     
      const renderChart = () => {
        const chartData = getChartData(data);

        const yAxisTickFormatter = (chartData) => {
          if (Number.isInteger(chartData)) {
            return chartData;
          } else {
            return '';
          }
        };


        return (
        <center>
          <BarChart className='expenseChart' width={600} height={300} margin={{ top: 55, right: 50, left: 50, bottom: 5 }} data={chartData} barSize={8} value={data.filter(item => item.type)} onClick={handleClick}>
            <XAxis dataKey="name" label={{ fontSize: 24, fontFamily: "italic" }}  style={{fontSize:"110%"}}>
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
            </XAxis>
            <YAxis style={{fontSize:"130%"}}  tickFormatter={yAxisTickFormatter} label={{ value: 'Expense', angle: -90, position: 'insideLeft', fontSize: "130%" }}/>

            <Tooltip cursor={{fill: 'transparent'}}/>
           
            <Bar dataKey="value" fill="rgb(47, 225, 225)" barSize={40}  cursor="pointer" />
          </BarChart>
          </center>



        );
      }
    
      const renderTable = () => {
        
        // if (selectedBar !== null) {
        //   const type = selectedBar ? 'savings' : 'expense'
        if (selectedBar.length!==0){
          const tableData = data.filter(item => item.type === selectedBar);
         
          return (
            <>

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

{temp && <ExpenseTracker />}
</>

      );


}

export default ExpenseChart;



