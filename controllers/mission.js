const Mission = require('../models/mission');
const mongoose = require('mongoose');

//get all the user's missions
const getMissions = async (req, res) => {
    const missions = await Mission.find({ userId: req.user._id }).sort({ date: -1 })
    res.status(200).json({ missions })
}

//create new mission with tasks
const createMission = async (req, res) => {
    const { missionsName, date, importance, tasks } = req.body

    if (!missionsName || !date || !importance || !tasks) {
        return res.status(400).json({ error: 'Please fill in the fields' })
    }

    try {
        const mission = await Mission.create({
            mission: missionsName,
            date: date,
            importance: importance,
            tasks: tasks.split(',').map(x => {
                return { 'task': x.trim(), 'completed': false }
            }),
            userId: req.user._id

        })
        console.log('Mission has been added!')
        res.status(200).json({ mission })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//edit mission detail  
const editMission = async (req, res) => {
    const { id } = req.params
    const { missionsName, date, importance } = req.body

    let mission = await Mission.findOneAndUpdate({ _id: id }, {
        mission: missionsName,
        date: date,
        importance: importance
    })

    if (!mission) {
        return res.status(400).json({ error: 'No such mission' })
    }

    mission = await Mission.findById({ _id: id })

    console.log('Mission edited')
    res.status(200).json({ mission })
}

//delete mission and tasks  
const deleteMission = async (req, res) => {
    const { id } = req.params
    console.log(id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such mission' })
    }

    const mission = await Mission.findOneAndDelete({ _id: id })

    if (!mission) {
        return res.status(400).json({ error: 'No such mission' })
    }

    console.log('Deleted mission')
    res.status(200).json({ mission })
}

module.exports = { getMissions, createMission, editMission, deleteMission }