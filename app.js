const express = require('express');
const mongoose = require('mongoose');
const User = require('./Models/user');
const userController = require('./Controller/user-controller'); // Import the user controller
const taskController= require('./Controller/task-controller');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
app.use(
    cors({
      origin: 'http://localhost:3001',
    })
  );
app.use(express.json());

app.use('/user', userController);
app.use('/user/task',taskController);
mongoose.connect("mongodb+srv://prateekprakash11:EZOmTENU9CvdIyGb@cluster0.t7pkk8g.mongodb.net/TaskManager?retryWrites=true&w=majority")
.then(()=>console.log("MongoDb Connected"))
.catch(err=>{
    console.log(err);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });























