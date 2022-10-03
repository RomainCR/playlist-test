const Track = require('../models/trackModel.js')
const mongoose = require('mongoose')
const got = require('got')

// GET all tracks
const getTracks = async (req, res) => {
  const user_id = req.userId._id
  try {
    // const tracks = await Track.find({ is_public: true }).sort({ createdAt: -1 }) 
    const tracks = await Track.find({ $or: [{ user_id }] }).sort({ createdAt: -1 })
    res.status(200).json(tracks)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// GET a single track
const getTrack = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  try {
    const track = await Track.findById(id)
    if (!track) {
      return res.status(404).json({ message: 'Track not found' })
    }
    res.status(200).json(track)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// POST a new track
const createTrack = async (req, res) => {
  const { title, link, artist } = req.body
  console.log(req.body)
  let emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
  if (emptyFields?.length) {
    return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
  }
  try {
    const user_id = req.userId._id
    const track = await Track.create({ title, link, artist, user_id })
    res.status(200).json(track)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST a new track soundcloud
const getData = async (req, res) => {
  const { link } = req.body
  let info = {
    title: '',
    artist: '',
    link: ''
  }
  let emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
  if (emptyFields?.length) {
    return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
  }
  const newLink = link.includes('youtube') ? link.split('?list')[0] : link.split('?')[0]
  console.log("newLink ---------> ", newLink)
  try {
    got(newLink).then((res) => {
      if (newLink.includes('youtu')) {
        const metaData = res.body.split("videoDescriptionHeaderRenderer")[1].split('text":"')[1].split('"}')[0]
        info.link = newLink
        info.title = metaData.split(" - ")[1]
        info.artist = metaData.split(" - ")[0]
        // console.log(JSON.parse(res.body.split('videoDescriptionHeaderRenderer')[1].split('"runs":')[1].split('},"channel"')[0]))
        // console.log(res.body.split("videoDescriptionHeaderRenderer")[1].split('text":"')[1].split('"}')[0])
      }
      if (newLink.includes('soundcloud')) {
        console.log(Number(res.body.split('"duration":')[1].split(',"')[0]) / 60000)
        if (link.includes('on.soundcloud')) {
          info.link = res.redirectUrls[0].split('?')[0]
        } else {
          info.link = newLink.split('?')[0]
        }
        info.title = res.body.split('Stream ')[1].split(' by')[0]
        info.artist = res.body.split(' by ')[1].split(' |')[0]
      }
      // console.log(res.redirectUrls[0].split('?')[0])
      // console.log(res.body.split('Stream ')[1].split(' by')[0])
      // console.log(res.body.split(' by ')[1].split(' |')[0])
    }).then(async () => {
      // const user_id = req.userId._id
      // const track = await Track.create({ title, link, artist, user_id })
      res.status(200).json(info)
    }
    )

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE a track
const deleteTrack = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  try {
    const track = await Track.findByIdAndDelete(id)
    if (!track) {
      return res.status(404).json({ message: 'Track not found' })
    }
    res.status(200).json({ message: 'Track deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE a track
const updateTrack = async (req, res) => {
  const { id } = req.params
  const emptyFields = Object.entries(req.body).filter(o => o[1] === '').map(a => a[0]) || []
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  if (emptyFields.length) {
    return res.status(400).json({ error: `Please fill${emptyFields.map(emp => ` ${emp}`)}`, emptyFields })
  }
  try {
    const track = await Track.findByIdAndUpdate(id, req.body, { new: true })
    if (!track) {
      return res.status(404).json({ message: 'Track not found' })
    }
    res.status(200).json(track)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createTrack,
  getTracks,
  getTrack,
  deleteTrack,
  updateTrack,
  getData
}
