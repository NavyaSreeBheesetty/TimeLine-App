const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/mydb")

// const uri = 'mongodb://127.0.0.1:27017/mydb'
//  mongoose.set('strictQuery', false);
//  mongoose.connect(uri)


.then(()=>{
    console.log("db connected");

})
.catch(()=>{
    console.log("failed");
})


const newTodoSchema=new mongoose.Schema({
    user:{
        type:String
    },
    time:{
        type:String
    },
    task:{
        type:String
    },
    date:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String
    }
})


const newExpenseSchema=new mongoose.Schema({
    user:{
        type:String
    },
    type:{
        type:String
    },
    names:{
        type:String
    },
    date:{ 
        type:String
    },
    amount:{
        type:Number
    }
})



const newBugSchema=new mongoose.Schema({

bugName:{
    type:String
},

bugURL:{
    type:String
},
bugDescription:{
    type:String
},
status:{
    type:String
},
createdAt:{
    type:String
},
updatedAt:{
    type:String
},
priority:{
    type:String
},
date:{
    type:"String"
},
time:{
    type:"String"
}
})


const newLeaveSchema=new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    stdt:{
        type:String
    },
    date:{
        type:String
    },
    enddt:{
        type:String
    },
    reason:{
        type:String
    },
    status:{
        type:[String]
    },
    dayscount:{
        type:Number
    },
    type:{
        type:String
    },
    dates:{
        type:String
    },
    time:{
        type:String
    }
})


const newInventorySchema=new mongoose.Schema({
    candname:{
        type:String
    },
  marks:{
        type:String
    },
    date:{
        type:String
    },
    time:{
        type:String
    }
})


// const conn=mongoose.connect
const ToDo=mongoose.model("ToDo",newTodoSchema)
const ExpensesTracker=mongoose.model("ExpensesTracker",newExpenseSchema)
const BugReport=mongoose.model("BugReport",newBugSchema)
const LeaveReport=mongoose.model("LeaveReport",newLeaveSchema)
const InventoryReport=mongoose.model("InventoryReport",newInventorySchema)


module.exports={ToDo,ExpensesTracker,BugReport,LeaveReport,InventoryReport}

