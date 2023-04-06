const mongoose = require('mongoose')

//mission schema
//needs => mission name, data, importance level, mission tasks
const MissionSchema = new mongoose.Schema({
  mission: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  importance: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('mission', MissionSchema, 'missions')
