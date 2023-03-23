import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts';
import BugsChart from  './BugsChart';
import _ from 'lodash';
import { Image } from 'semantic-ui-react';
import './style.css';


const BugReport = () => {

    const [bugs,setBugs]=useState([]);
    const  [selectedDate,setSelectedDate]=useState('');

useEffect(() => {
    axios.get('http://192.168.1.7:2805/bugs')
        .then(response => {
   const sortedDate = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
           const groupedDate = _.groupBy(sortedDate, 'date');
            const data = Object.keys(groupedDate).map(date => ({
                 date,
                 bugs: groupedDate[date].length
             }));
             setBugs(data);

              })
      .catch(error => console.error(error));
 }, []);   


    const handleBarClick = (e) => {
     setSelectedDate(e.date);
       
   };

   
  if (selectedDate) {
    return <BugsChart date={selectedDate} />;
}
const data=[...bugs];


  return (
<>
    <div style={{ position: 'absolute', top: 0, right: 0, height: '100vh', overflow: 'hidden' }} >
    <Image src="https://img.freepik.com/premium-vector/ladybug-with-closed-shell-beetle-cartoon-bug-design-flat-vector-illustration-isolated-white-background_257455-3194.jpg" className="moving-image" />
  </div>

    <center>
        <BarChart width={800} height={450} data={data} margin={{ top: 100, right: 50, left: 75, bottom: 5 }}>
            <XAxis dataKey="date"  style={{fontSize:"110%"}}/>
            <YAxis  style={{fontSize:"110%"}}/>
            <Tooltip cursor={{fill: 'transparent'}}/>
            {/* <Tooltip /> */}
            <Legend />
            <Bar dataKey="bugs" fill="#8884d8" onClick={handleBarClick} barSize={40} />
</BarChart>
</center>
</>


  )
}

export default BugReport
