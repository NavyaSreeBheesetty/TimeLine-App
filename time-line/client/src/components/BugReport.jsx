import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button, Modal,Icon,Label } from "semantic-ui-react";
import BugsChart from "./BugsChart";
import BugDateChart from "./BugDateChart";
import _ from "lodash";
import { Image } from "semantic-ui-react";
import "./style.css";
import Cookies from "universal-cookie";

const BugReport = () => {
  
  const cookie = new Cookies();
  const user = cookie.get("username");
  const isAdmin = cookie.get("admin") === "true" ? true : false;
  console.log(isAdmin)
  
  const [bugs, setBugs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sd,setSD]=useState('')
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.1.7:2805/bugs/" + cookie.get("username"))
      .then((response) => {

if(isAdmin==true){

        const sortedDate = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const groupedDate = _.groupBy(sortedDate, "date");
        const data = Object.keys(groupedDate).map((date) => ({
          date,
          bugs: groupedDate[date].length,
        }));
        setBugs(data);
      }
      else{
        const sortedDate = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const groupedDate = _.groupBy(sortedDate, "date");
        const data = Object.keys(groupedDate).map((date) => ({
          date,
          bugs: groupedDate[date].length,
        }));
        setBugs(data);
      }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleBarClick = (e) => {
    setSelectedDate(e.date);
  };

  if (selectedDate) {
    return <BugsChart date={selectedDate} />;
  }

  const handleSearchInputChange = (e) => {
    const searchedDates = e.target.value;

    setSearchDate(searchedDates);
  };

  if (searchDate) {
    return <BugDateChart date={searchDate} />;
  }

  const data = [...bugs];

  const yAxisTickFormatter = (bugs) => {
    if (Number.isInteger(bugs)) {
      return bugs;
    } else {
      return '';
    }
  };

 

  const yAxisTicks = data.map(({bugs}) => {
    return Number.isInteger(bugs) ? bugs : null;
  }).filter((tick, index, ticks) => tick !== null || index === 0 || index === ticks.length - 1);
  
  if (!yAxisTicks.includes(0)) {
    yAxisTicks.push(0);
  }

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

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Image
          src="https://img.freepik.com/premium-vector/ladybug-with-closed-shell-beetle-cartoon-bug-design-flat-vector-illustration-isolated-white-background_257455-3194.jpg"
          className="moving-image"
        />
      </div>
      <div className="bugReport">
        <center>
          <BarChart
            className="bugChart"
            width={800}
            height={450}
            data={data}
            margin={{ top: 100, right: 50, left: 95, bottom: 5 }}
          >
            <XAxis dataKey="date" style={{ fontSize: "130%" }} >
            <Label value="Date" position="insideBottom" dy={10} fontSize="130%" />
  </XAxis>
            <YAxis style={{fontSize:"130%"}} ticks={yAxisTicks} tickFormatter={yAxisTickFormatter} label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fontSize: "130%" }}/>
            <Tooltip cursor={{ fill: "transparent" }} />
            <Legend />
            <Bar
              dataKey="bugs"
              fill="rgb(82, 129, 183)"
              onClick={handleBarClick}
              barSize={40}
              cursor="pointer"
            />
          </BarChart>
        </center>

        <div class="ui icon input" id="search">
  <input class="prompt" type="date" placeholder="Search" onChange={(e)=>{setSD(e.target.value)}}/>  
  <div class="ui icon">
    <Button icon onClick={()=>{handleSearchInputChange(sd)}}>
      <Icon name='search' />
    </Button>
  </div>
</div>
      </div>
    </>
  );
};

export default BugReport;
