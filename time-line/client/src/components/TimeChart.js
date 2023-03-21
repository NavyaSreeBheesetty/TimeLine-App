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
  Legend,
} from "recharts";
import _ from "lodash";
import { Button, Modal, Table,Header } from "semantic-ui-react";
import "./style.css";
import Cookies from "universal-cookie";
import moment from "moment";
moment().format();
const TimeChart = (date) => {
  const [tasks, setTasks] = useState([]);
  const [deleted, setDeleted] = useState(0);
  const [pending, setPending] = useState(0);

  const [data, setData] = useState([]);

  const [selectedData, setSelectedData] = useState("");
  const [description, setDescription] = useState("");
  const [chart, setChart] = useState([]);

  const [open, setOpen] = useState(false);

  const cookie = new Cookies();
  const user = cookie.get("username");

  useEffect(() => {
    // axios
    //   .get(`http://192.168.1.7:2805/tasks`)
    axios
      .get(`http://localhost:2805/tasks`)

      .then((response) => {
        var c1= 0,
        c2=0,
        c3=0,
        c4=0;

         

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
          if (ele.status == "deleted") {
            c1++;
          } else if (ele.status == "pending") {
            c2++;
          }
          else if (ele.status == "completed") {
            c3++;
          }
          else if (ele.status == "inprogress") {
            c4++;
          }
         
        });
       
        setChart([
          {
            name: "deleted",
            value: c1,
            fill:"rgb(48, 81, 138)",
          
          },
          {
            name: "pending",
            value: c2,
            fill:"rgb(138, 48, 90)",
          },
          {
            name: "completed",
            value: c3,
            fill:"rgb(126, 138, 48)",
          },
          {
            name: "inprogress",
            value: c4,
            fill:"rgb(138, 87, 48)",
          },


        ]);
        const sortedTasks = filteredData;
        console.log(sortedTasks);

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
        console.log(temp);
        console.log(data);

        setTasks(temp);
      })
      .catch((error) => console.error(error));
  }, [date]);

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
    //  console.log(finalTasks)

    setSelectedData(finalTasks);
    console.log(finalTasks);
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  function handleButtonClick(desc) {
    setDescription(desc);
    setOpen(true);
  }

  return (
    <div style={{display:"flex"}}>
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
          />
          <YAxis />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="tasks" fill="rgb(48, 81, 138)" barSize={40} />
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
                  <Button
                    onClick={() => handleButtonClick(finalTasks.description)}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : null}

      <Modal
        open={open}
        // onClose={() => setOpen(false)}
        // size="tiny"
        onClose={()=>{}}
        onOpen={()=>setOpen(true)}
        // style={{ backgroundColor: "white", color: "black",width:"20%"}}
        style={{ maxHeight: "55%",margin:"10%",marginLeft:"30%",paddingLeft:"-500%" }}
      >
        {/* <Modal.Header>Description</Modal.Header> */}
          
        <Modal.Content >
        <Header content='Description'/>
          <p>{description}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
    <div>
    </div>
    <Chart chartData={chart} />
    </div>
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
    <PieChart width={500} height={400}>
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
  );
}

export default TimeChart;
