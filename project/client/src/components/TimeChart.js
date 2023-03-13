import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { Button, Modal, Table } from "semantic-ui-react";
import "./style.css"; 
import moment from 'moment';
moment().format();


const TimeChart = (date) => {

  

    const [tasks, setTasks] = useState([]);
   
    const [data, setData] = useState([]);

    const [selectedData, setSelectedData] = useState('');
    const [description, setDescription] = useState("");

    const [open, setOpen] = useState(false);


    useEffect(() => {
       

            axios.get(`http://localhost:2805/tasks`)

            .then(response => {
                 let filteredData=((response.data).filter(item => item.date===date.date ))      
                
                 setData(filteredData);
                 
                
                filteredData.sort((a,b)=>{
                    if(a.time < b.time) return -1;
                    if(a.time > b.time) return 1;
                    return 0;
                })
                const sortedTasks=filteredData
                console.log(sortedTasks);
           
                
                 const groupedTasks = _.groupBy(sortedTasks, 'time');
                
                 const data = Object.keys(groupedTasks).map(time => ({
                    time,
                    tasks: groupedTasks[time].length
                   
                }));
                var label = ["00:00-02:00","02:01-04:00","04:01-06:00","06:01-08:00","08:01-10:00","10:01-12:00","12:01-14:00","14:01-16:00","16:01-18:00","18:01-20:00","20:01-22:00","22:01-24:00"]

                
                
var arr2=[]
var fromTime = "00:00";
var toTime = "02:00";
var filteredTasks = data.filter(t => t.time >= fromTime && t.time <= toTime);
arr2.push(filteredTasks.length)

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

 
  var filteredTasks = data.filter(t => t.time >= fromTime && t.time <= toTime);
  
  arr2.push(filteredTasks.length)
  
}


console.log(arr2)
const filteredArr1 = arr2.filter((num) => num !== 0);
const filteredArr2 = label.filter((val, index) => arr2[index] !== 0);

console.log(filteredArr1); 
console.log(filteredArr2);                

            console.log(filteredArr1,filteredArr2)
                var temp=[]

                for (var j in filteredArr1){
                    temp.push({tasks:filteredArr1[j],label1:filteredArr2})
                    
                }
                console.log(temp)
               console.log(data)
                
             setTasks(temp);

            })
            .catch(error => console.error(error));
    }, [date]);

     const handleBarClick = (e) => {
        const clickedLabel = e.activeLabel;
        console.log(clickedLabel);


        var startTime=clickedLabel.split("-")[0];
        console.log(startTime)

             var endTime=clickedLabel.split("-")[1];
             console.log(endTime)


             var finalTasks = data.filter(task => task.time >= startTime && task.time <= endTime);
             finalTasks.sort((a, b) => a.time.localeCompare(b.time));
            //  console.log(finalTasks)


               setSelectedData(finalTasks);
              console.log(finalTasks)
              


    };


      if (data.length === 0) {
        return <div>Loading...</div>;
      }



      function handleButtonClick(desc) {
        setDescription(desc);
        setOpen(true);
      }

    return (

      <>
      <center>
        <BarChart width={400} height={400} data={tasks} onClick={handleBarClick}>
      <XAxis
        dataKey='label1'
        onClick={(e) => handleBarClick(e)}
        type='category'
      />
      <YAxis />
      <Bar dataKey='tasks' fill='#8884d8' barSize={30} />
    </BarChart>
    </center>


{selectedData ? (
  
        <Table className="my-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Task</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {selectedData.map((finalTasks, index) => (
              <Table.Row key={index}>
                <Table.Cell>{finalTasks.time}</Table.Cell>
                <Table.Cell>{finalTasks.task}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleButtonClick(finalTasks.description)}>
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        
      ) : null}

      
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Description</Modal.Header>
        <Modal.Content>
          <p>{description}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default TimeChart;