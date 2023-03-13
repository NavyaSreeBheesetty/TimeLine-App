const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/react-login")
mongoose.connect("mongodb://127.0.0.1:27017/mydb");

// const uri = 'mongodb://127.0.0.1:27017/mydb'
mongoose
  .set("strictQuery", false)
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("failed");
  });

const newTodoSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  time: {
    type: String,
  },
  task: {
    type: String,
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
});

const newExpenseSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  type: {
    type: String,
  },
  names: {
    type: String,
  },
  date: {
    type: String,
  },
  amount: {
    type: Number,
  },
});

const ToDo = mongoose.model("ToDo", newTodoSchema);
const ExpensesTracker = mongoose.model("ExpensesTracker", newExpenseSchema);

module.exports = { ToDo, ExpensesTracker };
