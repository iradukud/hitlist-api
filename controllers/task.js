const mongoose = require('mongoose');
const Mission = require('../models/mission');

//adds new task
const addTask = async (req, res) => {
    try {
        let mission = await Mission.findOneAndUpdate({ _id: req.params.id }, {
            $push: { tasks: { task: req.body.task, completed: false } }
        });
        console.log('task added');

        mission = await Mission.findById({ _id: req.params.id })

        res.status(200).json({ mission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
}

//edit task  
const editTask = async (req, res) => {
    try {
        let mission = await Mission.findOneAndUpdate({ _id: req.params.id }, {
            $set: { 'tasks.$[i].task': req.body.task }
        }, {
            arrayFilters: [{ 'i.task': req.body.oldTask }]
        });
        console.log('task edited');

        mission = await Mission.findById({ _id: req.params.id })

        res.status(200).json({ mission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

//delete task in mission  
const deleteTask = async (req, res) => {
    try {
        let mission = await Mission.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { tasks: { task: req.params.task.trim() } }
        }, {
            multi: true
        })
        console.log('task deleted')

        mission = await Mission.findById({ _id: req.params.id })

        res.status(200).json({ mission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//marks task in mission as completed: true in DB
const markCompletion = async (req, res) => {
    try {
        let mission = await Mission.findById({ _id: mongoose.Types.ObjectId(req.params.id) })

        if (mission['tasks'].filter((obj) => obj['task'] == req.body.task)[0]['completed']) {
            mission = await Mission.findOneAndUpdate({ _id: req.params.id }, {
                $set: { 'tasks.$[i].completed': false }
            }, {
                arrayFilters: [{ 'i.task': req.body.task }]
            })
            console.log('task marked not completed')
        } else {
            mission = await Mission.findOneAndUpdate({ _id: req.params.id }, {
                $set: { 'tasks.$[i].completed': true }
            }, {
                arrayFilters: [{ 'i.task': req.body.task }]
            })
            console.log('task marked completed')
        }
        mission = await Mission.findById({ _id: req.params.id })
        res.status(200).json({ mission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { addTask, editTask, deleteTask, markCompletion }