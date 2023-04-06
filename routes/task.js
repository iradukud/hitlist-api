const express = require('express')
const { addTask, editTask, deleteTask, markCompletion } = require('../controllers/task')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

router.put('/add/:id', addTask)
router.put('/edit/:id', editTask)
router.delete('/delete/:id/:task', deleteTask)
router.put('/markCompletion/:id', markCompletion)

module.exports = router