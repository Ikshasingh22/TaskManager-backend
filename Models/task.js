
// models/User.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName:{
        type:String,
        required:true,
    },
    taskDescription:{
        type:String,
    },
    taskId:{
        type:String,
        required:true,
        unique:true
    },
    createdFor:{
        type:Date,
        required:true,
    },
    createdAt:{
         type:Date,
         default: Date.now,
    },
    userEmail:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Task', taskSchema);

