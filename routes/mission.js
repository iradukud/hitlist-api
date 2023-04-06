const express = require('express')
const { getMissions,createMission,editMission,deleteMission} = require('../controllers/mission')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

//get all missions
router.get('/missions', getMissions)
//create new missions
router.post('/create', createMission)
//edit existing mission
router.put('/editMission/:id', editMission)
//delete mission
router.delete('/deleteMission/:id', deleteMission)

module.exports = router