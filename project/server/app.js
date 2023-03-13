const mongoose = require('mongoose');
const express=require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const {ToDo,ExpensesTracker}=require("./mongo");



//Post method for TODo list
app.post('/create/task', (req, res) => {
  console.log(req.body);
  const toDo = new ToDo(
    {
      time:req.body.time,
      task:req.body.task,
      date:req.body.date
    }
   );

   toDo.save();
   res.send("ok")
});

//get for to do 

app.get('/tasks', async (req, res) => {
  const tasks = await ToDo.find({});
  res.json(tasks);
});



//Post method for expenses tracker
app.post('/create/expenses', (req, res) => {
  console.log(req.body);
  const expensesTracker = new ExpensesTracker(
    {
      date:req.body.date,
      names:req.body.names,
      type:req.body.type,
     amount:req.body.amount,
     user:req.body.user
    }
   );
console.log(expensesTracker)
   expensesTracker.save();
   res.send("ok")
});


//get for expenses

app.get('/expenses', async (req, res) => {
  const expenses= await ExpensesTracker.find({});
  res.json(expenses);
});


app.listen(2805, () => {
  console.log('Server started on port 2805');
});















// _id:isObjectId('64048a5763a19ae338374693')
// username:"User 1"
// task:"hii"
// time:"02:04 PM"
// assigned:false
// status:"deleted"
// color:"rgb(255,255,26)"
// __v:0





