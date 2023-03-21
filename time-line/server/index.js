const express=require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require("axios")
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {ToDo,ExpensesTracker,BugReport,LeaveReport,InventoryReport}=require("./mongo");



// Test database connection
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('Connected to database');
});


//health check

app.get('/health', (req, res) => {
  if (conn.readyState === 1) {
    res.json({ Server:"healthy",Database:'established' });
  } else {
    res.status(500).json({ Server:"healthy",Database:'Unestablished'});
  }
});


const convert12to24 = (time) => {
  let [hours, minutes, ampm] = time.split(/[\s:]+/);
  hours = parseInt(hours, 10);
  ampm = (ampm || "").toUpperCase();
  if (ampm === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}



// Post method for ToDo list
// app.post('/todo', (req, res) => {
//   const toDo = new ToDo(
//     {
//       user:req.body.user,
//       // time:req.body.time,
//       time:convert12to24(req.body.time),
//       task:req.body.task,
//       date:req.body.date,
//       description:req.body.description

//     }
//    );
// console.log(toDo);
//    toDo.save();
//    res.send("ok")
// });


fetch("http://192.168.1.43:3020/getupdateddata")
  .then(res => res.json())
  .then(data => {
    // delete previous data from the ToDo collection
    ToDo.deleteMany({})
      .then(() => {
        // save new data in the ToDo collection
        data.map(ele => {
          const toDo = new ToDo({
            time: ele.time,
            task: ele.task,
            date: ele.date,
            description:ele.desc,
            user:ele.username,
            status:ele.status
          });
          toDo.save();
        });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });



//get for to do 

app.get('/tasks', async (req, res) => {
  const tasks = await ToDo.find({});
  res.json(tasks);
});



//Post method for expenses tracker

fetch(" http://192.168.1.11:3006/transaction").then(res=>res.json())
.then(data=>
  {
    ExpensesTracker.deleteMany({})
     .then(() => {
    data.map(ele=>
    {
      const expensesTracker = new ExpensesTracker(
        {
          date:ele.date,
      names:ele.name,
      type:ele.type,
     amount:ele.amount,
     user:ele.user
        })
        expensesTracker.save();

    })
  })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });








//get for expenses

app.get('/expenses', async (req, res) => {
  const expenses= await ExpensesTracker.find({});
  res.json(expenses);
});




//Post method for bug Report
app.post('/bugReport', (req, res) => {
const bugReport = new BugReport(
    {
    date: (req.body.createdAt.substring(0,10)),
    time:(req.body.createdAt.substring(11,16)),

      createdAt:req.body.createdAt,
      updatedAt:req.body.updatedAt,
     bugName:req.body.bugName,
      bugURL:req.body.bugURL,
     bugDescription:req.body.bugDescription,
     status:req.body.status,
     priority:req.body.priority
    }
   );

console.log(bugReport.date)
console.log(bugReport.time)
   bugReport.save();
   res.send("ok")
});


//get for BugReport

app.get('/bugs', async (req, res) => {
  const bugs= await BugReport.find({});
  res.json(bugs);
});




//Post method for LeaveReport

// app.post('/leaveReport', (req, res) => {
//   const { username, email, stdt, date } = req.body;
//   const dateObj = new Date(date);
//   const year = dateObj.getFullYear();
//   const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//   const day = String(dateObj.getDate()).padStart(2, '0');
//   const formattedDate = `${year}-${month}-${day}`;

//   const leaveReport = new LeaveReport(
//     {
//       username:req.body.username,
//       email:req.body.email,
//      stdt:req.body.stdt,
//     date:req.body.date,
//      enddt:req.body.enddt,
//      status:req.body.status,
//      reason:req.body.reason,
//      dayscount:req.body.dayscount,
//      type:req.body.type,
//      dates:formattedDate
     
//     }
//    );
//    leaveReport.save();
//    res.send("ok")
// });





// 192.168.1.77:4000/requests

fetch("http://192.168.1.77:4000/requests")
  .then(res => res.json())
  .then(data =>
     {

    LeaveReport.deleteMany({})
      
      .then(() => {
       
        data.map(ele => {
          const dateObj = new Date(ele.date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;

          const leaveReport = new LeaveReport({
            username: ele.username,
            email: ele.email,
            stdt: ele.stdt,
            date: ele.date,
            enddt: ele.enddt,
            status: ele.status,
            reason: ele.reason,
            dayscount: ele.dayscount,
            type: ele.type,
            dates: formattedDate
          });
          leaveReport.save();
        });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => { 
    console.log(err);
  });



//get for LeaveReport

app.get('/leaves', async (req, res) => {
  const leaves= await LeaveReport.find({});
  res.json(leaves);
});



//post method for inventory
const convert = (time) => {
  let [hours, minutes, ampm] = time.split(/[\s:]+/);
  hours = parseInt(hours, 10);
  ampm = (ampm || "").toUpperCase();
  if (ampm === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

app.post('/invent', (req, res) => {
  const inventoryReport = new InventoryReport(
    {
      date: (req.body.time.substring(0,8)),
      time:convert(req.body.time.substring(10,17)),

      user:req.body.candname,
      marks:req.body.marks,
   
     

    }
   );
   console.log(inventoryReport)
   inventoryReport.save();
   res.send("ok")
});


//grt method for inventory
app.get('/inventory', async (req, res) => {
  const inventory= await InventoryReport.find({});
  res.json(inventory);
});




app.post("/auth", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/checkAuth",

      {
        session_id: req.body.session_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(503).send("Server Down");
    });
});

app.post("/logout", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/clearSession",


      { session_id: req.body.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) =>
      response.data ? res.send(response.data) : response.send(false)
    );
});

app.listen(2805, () => {
  console.log('Server started on port 2805');
});



















// const express=require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// const {ToDo,ExpensesTracker}=require("./mongo");
// const userName="navya";
// const password="sree";



// function user(req,res,next){

// if(req.body.name===userName && req.body.password===password)
// {

// next();
//    return; 
// }

// else{
//   res.send("invalid user")
//   return;
// }


// }
// app.post('/create/task', user,(req, res) => {

//  const userDetails = new ToDo(
//       {
//         name:req.body.name,
//         password:req.body.password
       
//       });

// res.send("okk");

//     });

//     app.post('/hii',user,(req,res)=>{
//       console.log(req.body);
//       res.send("hii");
//     })



//     app.post('/navya',user,(req,res)=>{
//       res.send("navya");
//     })

//     app.post('/hello',user,(req,res)=>{
//       res.send("hello");
//     })

//     app.post('/hola',user,(req,res)=>{
//       res.send("hola");
//     })
  

//   app.listen(3805, () => {
//     console.log('Server started on port 3805');
//   });










// {
//     "bugName": "test bug",
//     "bugURL": "http:localhost:3308/user",
//     "bugDescription": "Testing db",
//     "status": "Fixed",
//     "createdAt": "2023-02-23T12:07:53.401+00:00",
//     "updatedAt": "2023-03-07T04:41:53.401+00:00",
//     "priority": "Moderate"
//     }