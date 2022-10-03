const express = require('express')
const { createTrack, getTrack, getTracks, deleteTrack, updateTrack, getData } = require('../controllers/trackController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET all workouts
router.get('/', getTracks)

// GET a single workout
router.get('/:id', getTrack)

// POST a new workout
router.post('/', createTrack)

// POST info
router.post('/info', getData)

// DELETE a workout
router.delete('/:id', deleteTrack)

// UPDATE a workout
router.patch('/:id', updateTrack)

module.exports = router