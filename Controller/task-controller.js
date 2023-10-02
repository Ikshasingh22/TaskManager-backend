const express = require('express');
const verifyToken = require('../Util/Authentication');
const Task=require('../Models/task')
const router = express.Router();
//getting all the task by user
router.get('/alltasks', verifyToken, async (req, res) => {
    try {
      const userEmail = req.user.email;
      const allTasks = await Task.find({ userEmail });
      const response = {
        success: true,
        tasks: allTasks 
      };
      
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
  });
//adding a task
router.post('/addtask', verifyToken, async (req, res) => {
  try {
    const { taskName, taskDescription ,createdFor} = req.body;
    const userEmail = req.user.email;
    const randomDigits = Math.floor(Math.random() * 10000); 
    const code = "IP";
    const taskId = `${code}${randomDigits}`;
    //generating taskId
    const existingTask = await Task.findOne({ taskId });
    if (existingTask) {
      //method to check if taskId is unique and generating another unique id
      let isUnique = false;
      let newTaskId;
      while (!isUnique) {
        const newRandomDigits = Math.floor(Math.random() * 10000);
        newTaskId =  `${code}${newRandomDigits}`;
        const duplicateTask = await Task.findOne({ taskId: newTaskId });
        if (!duplicateTask) {
          isUnique = true;
        }
      }
      taskId = newTaskId;
    }

    const currentDate = new Date();
    const createdAtDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const newTask = new Task({
      taskId:taskId,
      userEmail:userEmail,
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      createdFor: req.body.createdFor,
      createdAt:createdAtDate
    });
    await newTask.save();
    const response = {
      message: 'Task added successfully',
     success:true
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while adding the task' });
  }
});
//updating task
router.put('/updatetask/:taskId', verifyToken, async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const { taskDescription,taskName} = req.body;
      const userEmail = req.user.email;
      //checking if such task exists
      const task = await Task.findOne({ taskId: taskId, userEmail: userEmail });
      if (!task) {
        
        const response = {
          message: 'No such Task Exists',
         success:false
        };
        return res.status(404).json(response);
      }
      task.taskDescription = taskDescription;
      task.taskName=taskName;
     
      await task.save();
      const response = {
        message: 'Task Updated successfully',
       success:true,
       task:task
      };
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while updating the task' });
    }
  });
  //getting details of single task
router.get('/taskdetails/:taskId', verifyToken, async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const userEmail = req.user.email;
      //checking if task exists 
      const task = await Task.findOne({  taskId: taskId, userEmail: userEmail  });
      if (!task) {
        const response = {
          message: 'No Task Exists',
         success:false
        };
        return response.status(401).json(response);
      }
      const response = {
        task:task,
       success:true
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching the task' });
    }
  });
  //deleting task
  router.delete('/deletetask/:taskId', verifyToken, async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const userEmail = req.user.email;
      //checking if task exists
      const task = await Task.findOne({  taskId: taskId, userEmail: userEmail });
      
      if (!task) {
        const response = {
          message: 'Task Doesnt Exists',
         success:false
        };
        return res.status(404).json(response);
      }
      await Task.deleteOne({  taskId: taskId });
      const response = {
        message: 'Task deleted successfully',
       success:true
      };
      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
  });
  
  
  
  module.exports = router;
  


