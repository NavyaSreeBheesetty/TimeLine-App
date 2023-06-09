import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table,Icon,Label } from "semantic-ui-react";
import "./style.css";
import Pagination from "react-js-pagination";
import BugReport from './BugReport';
import BugDateChart from './BugDateChart';
import Cookies from "universal-cookie";

const BugsChart = (date) => {
  const cookie = new Cookies();
    const user = cookie.get("username");
    const isAdmin = cookie.get("admin") === "true" ? true : false;
    console.log(isAdmin)

  const [bugs, setBugs] = useState([]);
   
  const [data, setData] = useState([]);

  const [selectedData, setSelectedData] = useState([]);
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(2);


  
  useEffect(() => {
       

    // axios.get(`http://192.168.1.7:2805/bugs`)
    axios.get("http://192.168.1.7:2805/bugs/" + cookie.get("username"))

    .then(response => {

      let filteredData=((response.data).filter(item => item.date===date.date )) 
                 setData(filteredData);


                 filteredData.sort((a,b)=>{
                  if(a.time < b.time) return -1;
                  if(a.time > b.time) return 1;
                  return 0;
              })
              const sortedBugs=filteredData
              console.log(sortedBugs);
         
              
               const groupedBugs = _.groupBy(sortedBugs, 'time');
              
               const data = Object.keys(groupedBugs).map(time => ({
                  time,
                  bugs: groupedBugs[time].length
                 
              }));

              var label = ["00:00-02:00","02:01-04:00","04:01-06:00","06:01-08:00","08:01-10:00","10:01-12:00","12:01-14:00","14:01-16:00","16:01-18:00","18:01-20:00","20:01-22:00","22:01-24:00"]

                
                
              var arr2=[]
              var fromTime = "00:00";
              var toTime = "02:00";
              var filteredBugs = data.filter(t => t.time >= fromTime && t.time <= toTime);
              arr2.push(filteredBugs.length)
              
              for(var i=2;i<=22;i=i+2)
              {
              var fr,to;
                if(i<10)
              {
                fr="0"+i;
                if(i===8)
                {
                  to=(i+2);
                }
                else{
                  to="0"+(i+2);
                }
               
                var fromTime = fr+":"+"01";
                
                var toTime = to+":"+"00";
              }
              else{
               
                var fromTime = i+":"+"01";
                var toTime = (i+2)+":"+"00";
              }
              
               
                var filteredBugs = data.filter(t => t.time >= fromTime && t.time <= toTime);
                
                arr2.push(filteredBugs.length)
                
              }
              
              
              console.log(arr2)
              const filteredArr1 = arr2.filter((num) => num !== 0);
              const filteredArr2 = label.filter((val, index) => arr2[index] !== 0);
              
              console.log(filteredArr1); 
              console.log(filteredArr2);                
              
                          console.log(filteredArr1,filteredArr2)
                              var temp=[]
              
                              for (var j in filteredArr1){
                                  temp.push({bugs:filteredArr1[j],label1:filteredArr2})
                                  
                              }
                              console.log(temp)
                             console.log(data)
                              
                           setBugs(temp);
       })
            .catch(error => console.error(error));
    }, [date]);


const handleBarClick = (e) => {
        const clickedLabel = e.activeLabel;
        console.log(clickedLabel);


        var startTime=clickedLabel.split("-")[0];

             var endTime=clickedLabel.split("-")[1];
             var finalTasks = data.filter(task => task.time >= startTime && task.time <= endTime);
             finalTasks.sort((a, b) => a.time.localeCompare(b.time));
               setSelectedData(finalTasks);
    };
      if (data.length === 0) {
        return <div>No bugs reported</div>;
      }
      function handleButtonClick(desc) {
        setDescription(desc);
        setOpen(true);
      }



      const handlePreviousClick = () => {
        console.log("prev");
        setTemp(true);
    
        return <BugReport />;
      };



      const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
      };
    
    
      const indexOfLastTask = activePage * tasksPerPage;
      
      const indexOfFirstTask = indexOfLastTask - tasksPerPage;
      const currentTasks = selectedData.slice(indexOfFirstTask, indexOfLastTask);
      console.log(currentTasks)
      
      const TableRows =currentTasks.map((finalTasks, index) => {
       return <Table.Row id={finalTasks._id} key={index}>
      <Table.Cell>{finalTasks.bugName}</Table.Cell>
              <Table.Cell>{finalTasks.bugURL}</Table.Cell>
              <Table.Cell>{finalTasks.status}</Table.Cell>
            
              <Table.Cell>
                <Button onClick={() => handleButtonClick(finalTasks.bugDescription)}>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
      }
    );
     



  return (
    <>
    {!temp && <> <div className="timeChartButton">
      
      <Button icon labelPosition='right' class="ui button" onClick={handlePreviousClick}>
    <Icon name='left arrow' />Previous
  </Button>
      
    </div>


    <div className="chart-container">
    <center>
      <BarChart className="bugsChart" width={600} height={300} data={bugs} margin={{ top: 55, right: 50, left: 50, bottom: 5 }} onClick={handleBarClick}>
    <XAxis
      dataKey='label1'
      onClick={(e) => handleBarClick(e)}
      type='category'
      style={{fontSize:"130%"}}
    >
      label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }}
      </XAxis>
    <YAxis  style={{fontSize:"130%"}} label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }} />
    <Tooltip cursor={{fill: 'transparent'}}/>
    <Bar dataKey='bugs' fill='rgb(82, 129, 183)' barSize={40}  cursor="pointer"/>
  </BarChart>
  </center>


{selectedData.length!=0 ? (
<>
      <Table className="my-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>BugName</Table.HeaderCell>
            <Table.HeaderCell>BugURL</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* {selectedData.map((finalTasks, index) => (
            <Table.Row key={index}>
              <Table.Cell>{finalTasks.bugName}</Table.Cell>
              <Table.Cell>{finalTasks.bugURL}</Table.Cell>
              <Table.Cell>{finalTasks.status}</Table.Cell>
            
              <Table.Cell>
                <Button onClick={() => handleButtonClick(finalTasks.bugDescription)}>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))} */}
       
        {TableRows}
        </Table.Body>
      </Table>
      
      </>) : <></>}


      {selectedData.length!=0? (<> <Pagination
        activePage={activePage}
        itemsCountPerPage={tasksPerPage}
        totalItemsCount={data.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      /> </>):<></>}

    
    <Modal open={open} onClose={() => setOpen(false)}
       style={{ 
        width: "400px",
        height: "200px",
        margin: "auto",
        marginTop: "150px",
        backgroundColor: "white",
        color: "black",
        borderRadius: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)"
      }} basic>

      {/* <Modal.Header>Description</Modal.Header> */}
      <Modal.Content>
        <p style={{fontSize:"200%"}}> <b>Description</b></p>
        <p>{description}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} style={{backgroundColor:"rgb(82, 129, 183)"}}>Close</Button>
      </Modal.Actions>
    </Modal>
 


</div>

</> }

      {temp && <BugReport />}
    </>

  )
}

export default BugsChart
