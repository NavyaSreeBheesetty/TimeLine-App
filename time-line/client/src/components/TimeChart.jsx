import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Label
} from "recharts";
import TaskChart from "./ToDoChart";
import Pagination from "react-js-pagination";
import _ from "lodash";
import { Button, Modal, Table, Icon } from "semantic-ui-react";
import "./style.css";
import Cookies from "universal-cookie";


const TimeChart = (date) => {
  const [tasks, setTasks] = useState([]);
  const [temp, setTemp] = useState(false);

  const [data, setData] = useState([]);

  const [selectedData, setSelectedData] = useState([]);
  const [description, setDescription] = useState("");
  const [chart, setChart] = useState([]);

  const [open, setOpen] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(2);

  const cookie = new Cookies();
  const user = cookie.get("username");
  const isAdmin = cookie.get("admin") === "true" ? true : false;
  console.log(isAdmin)

  useEffect(() => {
    axios
      .get(`http://192.168.1.7:2805/tasks`)

      // axios.get('http://localhost:2805/tasks')

      .then((response) => {


        if(isAdmin==true){
          var c1 = 0,
          c2 = 0,
          c3 = 0,
          c4 = 0;

       
        let filteredData = response.data.filter(
          (item) => item.date === date.date
        );
        setData(filteredData);

        filteredData.sort((a, b) => {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          return 0;
        });
        filteredData.map((ele) => {
          if (ele.status === "deleted") {
            c1++;
          } else if (ele.status === "pending") {
            c2++;
          } else if (ele.status === "completed") {
            c3++;
          } else if (ele.status === "inprogress") {
            c4++;
          }
        });

        setChart([
          {
            name: "deleted",
            value: c1,
            fill: "rgb(48, 81, 138)",
          },
          {
            name: "pending",
            value: c2,
            fill: "rgb(138, 48, 90)",
          },
          {
            name: "completed",
            value: c3,
            fill: "rgb(126, 138, 48)",
          },
          {
            name: "inprogress",
            value: c4,
            fill: "rgb(138, 87, 48)",
          },
        ]);
        const sortedTasks = filteredData;

        const groupedTasks = _.groupBy(sortedTasks, "time");

        const data = Object.keys(groupedTasks).map((time) => ({
          time,
          tasks: groupedTasks[time].length,
        }));
        var label = [
          "00:00-02:00",
          "02:01-04:00",
          "04:01-06:00",
          "06:01-08:00",
          "08:01-10:00",
          "10:01-12:00",
          "12:01-14:00",
          "14:01-16:00",
          "16:01-18:00",
          "18:01-20:00",
          "20:01-22:00",
          "22:01-24:00",
        ];

        var arr2 = [];
        var fromTime = "00:00";
        var toTime = "02:00";
        var filteredTasks = data.filter(
          (t) => t.time >= fromTime && t.time <= toTime
        );
        arr2.push(filteredTasks.length);

        for (var i = 2; i <= 22; i = i + 2) {
          var fr, to;
          if (i < 10) {
            fr = "0" + i;
            if (i === 8) {
              to = i + 2;
            } else {
              to = "0" + (i + 2);
            }

            var fromTime = fr + ":" + "01";

            var toTime = to + ":" + "00";
          } else {
            var fromTime = i + ":" + "01";
            var toTime = i + 2 + ":" + "00";
          }

          var filteredTasks = data.filter(
            (t) => t.time >= fromTime && t.time <= toTime
          );

          arr2.push(filteredTasks.length);
        }

        console.log(arr2);
        const filteredArr1 = arr2.filter((num) => num !== 0);
        const filteredArr2 = label.filter((val, index) => arr2[index] !== 0);

        console.log(filteredArr1);
        console.log(filteredArr2);

        console.log(filteredArr1, filteredArr2);
        var temp = [];

        for (var j in filteredArr1) {
          temp.push({ tasks: filteredArr1[j], label1: filteredArr2 });
        }

        setTasks(temp);




      }



      else{


        var c1 = 0,
          c2 = 0,
          c3 = 0,
          c4 = 0;

        let filteredName = response.data.filter((item) => item.user === user);
        let filteredData = filteredName.filter(
          (item) => item.date === date.date
        );
        setData(filteredData);

        filteredData.sort((a, b) => {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          return 0;
        });
        filteredData.map((ele) => {
          if (ele.status === "deleted") {
            c1++;
          } else if (ele.status === "pending") {
            c2++;
          } else if (ele.status === "completed") {
            c3++;
          } else if (ele.status === "inprogress") {
            c4++;
          }
        });

        setChart([
          {
            name: "deleted",
            value: c1,
            fill: "rgb(48, 81, 138)",
          },
          {
            name: "pending",
            value: c2,
            fill: "rgb(138, 48, 90)",
          },
          {
            name: "completed",
            value: c3,
            fill: "rgb(126, 138, 48)",
          },
          {
            name: "inprogress",
            value: c4,
            fill: "rgb(138, 87, 48)",
          },
        ]);
        const sortedTasks = filteredData;

        const groupedTasks = _.groupBy(sortedTasks, "time");

        const data = Object.keys(groupedTasks).map((time) => ({
          time,
          tasks: groupedTasks[time].length,
        }));
        var label = [
          "00:00-02:00",
          "02:01-04:00",
          "04:01-06:00",
          "06:01-08:00",
          "08:01-10:00",
          "10:01-12:00",
          "12:01-14:00",
          "14:01-16:00",
          "16:01-18:00",
          "18:01-20:00",
          "20:01-22:00",
          "22:01-24:00",
        ];

        var arr2 = [];
        var fromTime = "00:00";
        var toTime = "02:00";
        var filteredTasks = data.filter(
          (t) => t.time >= fromTime && t.time <= toTime
        );
        arr2.push(filteredTasks.length);

        for (var i = 2; i <= 22; i = i + 2) {
          var fr, to;
          if (i < 10) {
            fr = "0" + i;
            if (i === 8) {
              to = i + 2;
            } else {
              to = "0" + (i + 2);
            }

            var fromTime = fr + ":" + "01";

            var toTime = to + ":" + "00";
          } else {
            var fromTime = i + ":" + "01";
            var toTime = i + 2 + ":" + "00";
          }

          var filteredTasks = data.filter(
            (t) => t.time >= fromTime && t.time <= toTime
          );

          arr2.push(filteredTasks.length);
        }

        console.log(arr2);
        const filteredArr1 = arr2.filter((num) => num !== 0);
        const filteredArr2 = label.filter((val, index) => arr2[index] !== 0);

        console.log(filteredArr1);
        console.log(filteredArr2);

        console.log(filteredArr1, filteredArr2);
        var temp = [];

        for (var j in filteredArr1) {
          temp.push({ tasks: filteredArr1[j], label1: filteredArr2 });
        }

        setTasks(temp);
      }
      

      })
      .catch((error) => console.error(error));
  }, [date, open]);

  const handleBarClick = (e) => {
    const clickedLabel = e.activeLabel;
    console.log(clickedLabel);

    var startTime = clickedLabel.split("-")[0];
    console.log(startTime);

    var endTime = clickedLabel.split("-")[1];
    console.log(endTime);

    var finalTasks = data.filter(
      (task) => task.time >= startTime && task.time <= endTime
    );
    finalTasks.sort((a, b) => a.time.localeCompare(b.time));

    setSelectedData(finalTasks);
    console.log(finalTasks);
  };

  if (data.length === 0) {
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Content>
          <p>NO activities reported</p>
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

  function handleButtonClick(desc) {
    setDescription(desc);
    setOpen(true);
  }

  const handleClick = () => {
    setTemp(true);

    return <TaskChart />;
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastTask = activePage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = selectedData.slice(indexOfFirstTask, indexOfLastTask);
  console.log(currentTasks);

  const TableRows = currentTasks.map((finalTasks, index) => {
    return (
      <Table.Row id={finalTasks._id} key={index}>
        <Table.Cell>{finalTasks.user}</Table.Cell>
        <Table.Cell>{finalTasks.time}</Table.Cell>
        <Table.Cell>{finalTasks.task}</Table.Cell>
        <Table.Cell>
          <Button onClick={() => handleButtonClick(finalTasks.description)}>
            View
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  });

  //  const yAxisTicks = data.map(({tasks}) => {
  //     return Number.isInteger(tasks) ? tasks : null;
  //   }).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length-1);

  //   if (!yAxisTicks.includes(0)) {
  //     yAxisTicks.push(0);
  //   }

  const yAxisTickFormatter = (tasks) => {
    if (Number.isInteger(tasks)) {
      return tasks;
    } else {
      return "";
    }
  };

  return (
    <>
      {!temp && (
        <>
          {" "}
          <div className="timeChartButton">
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
            <div className="chart-container">
              <center>
                <BarChart
                  className="timeChart"
                  width={600}
                  height={300}
                  data={tasks}
                  margin={{ top: 55, right: 50, left: 50, bottom: 5 }}
                  onClick={handleBarClick}
                >
                  <XAxis
                    dataKey="label1"
                    onClick={(e) => handleBarClick(e)}
                    type="category"
                    style={{ fontSize: "110%" }}
                  >

<Label value="Time" position="insideBottom" dy={10} fontSize="130%" />
  </XAxis>
            <YAxis style={{fontSize:"130%"}}  tickFormatter={yAxisTickFormatter}   label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }}/>


                  <YAxis
                    style={{ fontSize: "130%" }}
                    tickFormatter={yAxisTickFormatter}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="tasks" fill="rgb(48, 81, 138)" barSize={40}  cursor="pointer" />
                </BarChart>
              </center>

              {selectedData.length !== 0 ? (
                <>
                  <Table className="my-table">
                    <Table.Header>
                      <Table.Row>
                      <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Task</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {/* {selectedData.map((finalTasks, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{finalTasks.time}</Table.Cell>
                    <Table.Cell>{finalTasks.task}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() =>
                          handleButtonClick(finalTasks.description)
                        }
                      >
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))} */}

                      {TableRows}
                    </Table.Body>
                  </Table>
                </>
              ) : (
                <></>
              )}

              {selectedData.length !== 0 ? (
                <>
                  {" "}
                  <Pagination
                    activePage={activePage}
                    itemsCountPerPage={tasksPerPage}
                    totalItemsCount={data.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                  />{" "}
                </>
              ) : (
                <></>
              )}

              {/* <footer style={{textAlign:"center",color:"black"}}>&copy; Copyright 2023 &nbsp;Navya</footer> */}

              <Modal
                open={open}
                onClose={() => setOpen(false)}
                //These below 2 lines of code are for to close the modal by only clicking on the close button
                // onClose={() => {}}
                // onOpen={() => setOpen(true)}

                style={{
                  width: "400px",
                  height: "200px",
                  margin: "auto",
                  marginTop: "150px",
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* <Modal.Header>Description</Modal.Header> */}

                <Modal.Content>
                  {/* <Header content="Description" /> */}

                  <p style={{ fontSize: "200%" }}>
                    {" "}
                    <b>Description</b>
                  </p>
                  <p>{description}</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={() => setOpen(false)}
                    style={{ backgroundColor: "rgb(48, 81, 138)" }}
                  >
                    Close
                  </Button>
                </Modal.Actions>
              </Modal>
            </div>
            <div></div>
            <Chart chartData={chart} />
          </div>
        </>
      )}

      {temp && <TaskChart />}
    </>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Tasks ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(percentage ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function Chart({ chartData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <>
      <div className="pieChart">
        <PieChart width={500} height={400} >
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </div>
    </>
  );
}

export default TimeChart;
