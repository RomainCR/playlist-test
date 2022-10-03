const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')

// GET all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.userId._id
  try {
    // const workouts = await Workout.find({ is_public: true }).sort({ createdAt: -1 }) 
    const workouts = await Workout.find({ $or: [{ user_id }, { is_public: true }] }).sort({ createdAt: -1 })
    res.status(200).json(workouts)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// GET a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  try {
    const workout = await Workout.findById(id)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }
    res.status(200).json(workout)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// POST a new workout
const createWorkout = async (req, res) => {
  const { title, load, reps, is_public } = req.body

  let emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
  if (emptyFields?.length) {
    return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
  }
  try {
    const user_id = req.userId._id
    const workout = await Workout.create({ title, load, reps, user_id, is_public })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST a new workout soundcloud
// const createWorkout = async (req, res) => {
//   const { title, link, load, reps, is_public } = req.body
//   console.log("link", link)
//   let info = {
//     title: '',
//     artist: '',
//     url: ''
//   }
//   let emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
//   if (emptyFields?.length) {
//     return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
//   }
//   console.log(info)
//   try {
//     got(link).then((res) => {
//       info.url = res.redirectUrls[0].split('?')[0]
//       info.title = res.body.split('Stream ')[1].split(' by')[0]
//       info.artist = res.body.split(' by ')[1].split(' |')[0]
//       // console.log(res.redirectUrls[0].split('?')[0])
//       // console.log(res.body.split('Stream ')[1].split(' by')[0])
//       // console.log(res.body.split(' by ')[1].split(' |')[0])
//     }).then(async () => {
//       const user_id = req.userId._id
//       const workout = await Workout.create({ title, load, reps, user_id, is_public, link })
//       res.status(200).json(workout)
//     }
//     )

//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

// DELETE a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  try {
    const workout = await Workout.findByIdAndDelete(id)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }
    res.status(200).json({ message: 'Workout deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params
  const emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  if (emptyFields.length) {
    return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
  }
  try {
    const workout = await Workout.findByIdAndUpdate(id, req.body, { new: true })
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout
}
