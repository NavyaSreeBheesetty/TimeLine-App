import React, { useState, useEffect } from 'react';
import bg from '../images/bg.jpg';
import './style.css';

const Home = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayOfWeek}, ${dayOfMonth.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  };

  return (
    <div className='background-image'>
      <div className='date-time'>
      <div className='date'>{formatDate(date)}</div>
      <div className='time'>{date.toLocaleTimeString()}</div>
    </div>
    </div>
  );
};

export default Home;























// import React, { useState, useEffect } from 'react';
// import bg from '../images/bg.jpg';
// import './style.css';

// const Home = () => {
//   const [date, setDate] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDate(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className='background-image'>
//       <div className='date-time'>
//         {date.toLocaleDateString()} {date.toLocaleTimeString()}
//       </div>
//     </div>
//   );
// };

// export default Home;







