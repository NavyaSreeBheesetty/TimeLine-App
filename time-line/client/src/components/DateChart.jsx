import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import TimeChart from "./TimeChart";
import _ from "lodash";
import "semantic-ui-css/semantic.min.css";
import { Button, Icon, Modal } from "semantic-ui-react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import "./style.css";
import TaskChart from "./ToDoChart";

const DateChart = (date) => {
  const cookie = new Cookies();
  const user = cookie.get("username");
  const isAdmin=true;

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [temp, setTemp] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    axios
      .get("http://192.168.1.7:2805/tasks")

      .then((response) => {

if(isAdmin==true){

        
        const filteredData = response.data.filter(
          (item) => item.date === date.date
        );

        //         const data = filteredData.map(date => ({
        //           date,
        //           // tasks:filteredData[date].length
        //           tasks: date.tasks.length

        //       }));

        //       console.log(data)

        //  setTasks(data);

        const data = filteredData.reduce((acc, curr) => {
          const { date, tasks } = curr;
          if (acc[date]) {
            acc[date].tasks.push(tasks);
          } else {
            acc[date] = { date, tasks: [tasks] };
          }
          return acc;
        }, {});

        const taskData = Object.values(data).map((item) => ({
          date: item.date,
          tasks: item.tasks.length,
        }));

        console.log(taskData);

        setTasks(taskData);
      }


else{

  const filteredName = response.data.filter((item) => item.user === user);
  const filteredData = filteredName.filter(
    (item) => item.date === date.date
  );


  const data = filteredData.reduce((acc, curr) => {
    const { date, tasks } = curr;
    if (acc[date]) {
      acc[date].tasks.push(tasks);
    } else {
      acc[date] = { date, tasks: [tasks] };
    }
    return acc;
  }, {});

  const taskData = Object.values(data).map((item) => ({
    date: item.date,
    tasks: item.tasks.length,
  }));

  console.log(taskData);

  setTasks(taskData);
}




      })



      .catch((error) => console.error(error));
  }, [open]);

  const handleBarClick = (e) => {
    setSelectedDate(e.date);
  };
  useEffect(()=>{
    console.log("close");
  },[open])

  const handleClick = () => {
    setTemp(true);
    return <TaskChart />;
  };

  if (selectedDate) {
    return <TimeChart date={selectedDate} />;
  }

  const data = [...tasks];

  const yAxisTicks = data
    .map(({ tasks }) => {
      return Number.isInteger(tasks) ? tasks : null;
    })
    .filter(
      (tick, index, ticks) =>
        tick !== null || index === 0 || index === ticks.length - 1
    );

  if (!yAxisTicks.includes(0)) {
    yAxisTicks.push(0);
  }

  const yAxisTickFormatter = (tasks) => {
    if (Number.isInteger(tasks)) {
      return tasks;
    } else {
      return "";
    }
  };

  // if (data.length === 0) {
  //   return (
  //     <Modal open={open} onClose={()=>setOpen(false)}>
  //       <Modal.Content>
  //           <p>NO activities reported</p>
  //         </Modal.Content>
  //         <Modal.Actions>
  //         {/* <Button onClick={() => setOpen(false)} style={{backgroundColor:"rgb(82, 129, 183)"}}>Close</Button> */}
  //         <Button onClick={() => {
  //             setOpen(false);
  //             navigate('/TaskChart');
  //           }} style={{ backgroundColor: "rgb(82, 129, 183)" }}>
  //             Close
  //           </Button>
  //       </Modal.Actions>
  //     </Modal>
  //   );
  // }

  if (data.length === 0) {
    return (
      // <Modal open={open} onClose={()=>setOpen(false)}>
      <Modal open  onClose={()=>setOpen(false)} style={{
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

  return (
    <>
      {!temp && (
        <>
          {" "}
          <div className="dateChartButton">
            <Button
              icon
              labelPosition="right"
              class="ui button"
              onClick={handleClick}
            >
              <Icon name="left arrow" />
              Previous
            </Button>
          </div>
          <div style={{ display: "flex" }}>
            <center>
              <BarChart
                className="todoChart"
                width={800}
                height={450}
                data={data}
                margin={{ top: 100, right: 50, left: 95, bottom: 5 }}
              >
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: "black" }}
                  tickLine={{ stroke: "black" }}
                  style={{ fontSize: "130%" }}
                />
                <YAxis
                  style={{ fontSize: "130%" }}
                  ticks={yAxisTicks}
                  tickFormatter={yAxisTickFormatter}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Legend />
                <Bar
                  dataKey="tasks"
                  fill="rgb(82, 129, 183)"
                  onClick={handleBarClick}
                  barSize={40}
                />
              </BarChart>
            </center>
          </div>
        </>
      )}

      {temp && <TaskChart />}
    </>
  );
};

export default DateChart;
