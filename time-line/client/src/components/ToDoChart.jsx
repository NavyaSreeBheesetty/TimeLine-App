import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Label,Legend } from 'recharts';
import TimeChart from './TimeChart';
import DateChart from './DateChart';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import { Button,Modal,Icon,Form, Checkbox  } from "semantic-ui-react";
import Cookies from "universal-cookie";
import BarChartComponent from './BarChartComponent';
import "./style.css"; 



const TaskChart = () => {
    const [tasks, setTasks] = useState([]);
    const [sd,setSD]=useState('')
    const [selectedDate, setSelectedDate] = useState('');  
     const [searchDate, setSearchDate] = useState('');
     const [open, setOpen] = useState(false);
     const [value, setValue] = useState('')
    const cookie = new Cookies();
    const user = cookie.get("username");
    const isAdmin = cookie.get("admin") === "true" ? true : false;
    console.log(isAdmin)
    
    useEffect(() => {
      // axios.get('http://192.168.1.7:2805/tasks')
      axios.get('http://localhost:2805/tasks')
   
          .then(response => {

            if(isAdmin==true){
              const sortedDates = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
              const groupedDates = _.groupBy(sortedDates, 'date');
              const data = Object.keys(groupedDates).map(date => ({
                  date,
                  tasks: groupedDates[date].length
              }));
              setTasks(data);
            }

            else{
              
              let filteredUser=response.data.filter((item) => item.user === user);
           console.log(filteredUser)
                 const sortedDates = filteredUser.sort((a, b) => new Date(a.date) - new Date(b.date));
                 const groupedDates = _.groupBy(sortedDates, 'date');
                 const data = Object.keys(groupedDates).map(date => ({
                     date,
                     tasks: groupedDates[date].length
                 }));
                 setTasks(data);
            }
          })
          .catch(error => console.error(error));
  }, []);



// for To Do




const handleSearchInputChange = (ele) => {
const searchedDates=ele

  setSearchDate(searchedDates);
};
if(searchDate){
  return < DateChart date={searchDate}/>;
}
// const handleBarClick = (e) => {
//      setSelectedDate(e.date);   
//    };

//   if (selectedDate) {
//     return <TimeChart date={selectedDate} />;
// }

  const data=[...tasks];


 

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
  <BarChartComponent data={data} />
  
  </>
);
};

export default TaskChart;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {BarChart, Bar, XAxis, YAxis,Tooltip, Label,Legend } from 'recharts';
// import TimeChart from './TimeChart';
// import DateChart from './DateChart';
// import _ from 'lodash';
// import 'semantic-ui-css/semantic.min.css';
// import { Button,Modal,Icon } from "semantic-ui-react";
// import Cookies from "universal-cookie";
// import "./style.css";


// const TaskChart = ({ isAdmin, user }) => {
//   const [tasks, setTasks] = useState([]);
//   const [searchDate, setSearchDate] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [dateRangeType, setDateRangeType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

  

//   useEffect(() => {
//     axios
//       .get("http://localhost:2805/tasks")
//       .then((response) => {
//         if (isAdmin == true) {
//           const sortedDates = response.data.sort(
//             (a, b) => new Date(a.date) - new Date(b.date)
//           );
//           const groupedDates = _.groupBy(sortedDates, "date");
//           const data = Object.keys(groupedDates).map((date) => ({
//             date,
//             tasks: groupedDates[date].length,
//           }));
//           setTasks(data);
//         } else {
//           let filteredUser = response.data.filter(
//             (item) => item.user === user
//           );
//           console.log(filteredUser);
//           const sortedDates = filteredUser.sort(
//             (a, b) => new Date(a.date) - new Date(b.date)
//           );
//           const groupedDates = _.groupBy(sortedDates, "date");
//           const data = Object.keys(groupedDates).map((date) => ({
//             date,
//             tasks: groupedDates[date].length,
//           }));
//           setTasks(data);
//         }
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   const handleSearchInputChange = (ele) => {
//     const searchedDates = ele;
//     setSearchDate(searchedDates);
//   };

//   const handleBarClick = (e) => {
//     setSelectedDate(e.date);
//   };

//   const handleSelectChange = (e) => {
//     setDateRangeType(e.target.value);
//   };

//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value);
//   };

//   const handleEndDateChange = (e) => {
//     setEndDate(e.target.value);
//   };

//   const handleDateRangeSubmit = () => {
//     setSearchDate(`${startDate}-${endDate}`);
//   };

//   if (searchDate) {
//     return <DateChart date={searchDate} />;
//   }

//   if (selectedDate) {
//     return <TimeChart date={selectedDate} />;
//   }

//   const data = [...tasks];

//   let datePicker;

//   if (dateRangeType === "onedate") {
//     datePicker = (
//       <div className="ui input" id="search">
//         <input
//           className="prompt"
//           type="date"
//           placeholder="Search"
//           onChange={(e) => {
//             setStartDate(e.target.value);
//           }}
//         />
//       </div>
//     );
//   } else if (dateRangeType === "twodates") {
//     datePicker = (
//       <div className="ui form">
//         <div className="two fields">
//           <div className="field">
//             <div className="ui input">
       
//             <input
//   type="date"
//   placeholder="Start Date"
//   value={startDate}
//   onChange={handleStartDateChange}
// />

//   </div></div>
//   </div>
//   <div className="field">
//     <div className="ui input">
//       <input
//         type="date"
//         placeholder="End Date"
//         onChange={handleEndDateChange}
//       />
//     </div>
//   </div>
//   <div className="field">
//     <Button color="teal" onClick={handleDateRangeSubmit}>
//       Search
//     </Button>
//   </div>
// </div>


// );
// }

// return (

//   <div>
//     <div className="ui container">
//       <div className="ui secondary menu">
//         <div className="right menu">
//           <div className="ui input" id="search">
//             <input
//               className="prompt"
//               type="text"
//               placeholder="Search..."
//               onChange={(e) => handleSearchInputChange(e.target.value)}
//             />
//             <i className="search icon"></i>
//           </div>
//           <div className="ui dropdown">
//             <select
//               className="ui dropdown"
//               value={dateRangeType}
//               onChange={handleSelectChange}
//             >
//               <option value="">Select Date Range</option>
//               <option value="onedate">One Date</option>
//               <option value="twodates">Two Dates</option>
//             </select>
//           </div>
//           {datePicker}
//         </div>
//       </div>
//     </div>
//     <div className="ui container">
//       <BarChart width={1000} height={300} data={data}>
//         <XAxis dataKey="date" />
//         <YAxis  />
//         <Tooltip />
//         <Bar dataKey="tasks" fill="#82ca9d" onClick={handleBarClick} />
//       </BarChart>
//     </div>
//   </div>
// );
// }
// export default TaskChart;





