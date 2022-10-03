import React, { useState, useEffect } from 'react'
import { useTracksContext } from '../hooks/useTracksContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const TrackForm = () => {
  const { user } = useAuthContext();

  const { dispatch, globalTrack } = useTracksContext()
  const emptyTrack = {
    title: '',
    link: '',
    artist: '',
  }
  const [track, setTrack] = useState(emptyTrack)
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    if (globalTrack) {
      setTrack(globalTrack)
    }
  }, [globalTrack])

  console.log(track)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create a track')
      return
    }
    if (track._id) {
      console.log("track", track)
      const res = await fetch(`/api/tracks/${track._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`

        },
        body: JSON.stringify(track),
      })
      const json = await res.json()
      if (res.ok) {
        dispatch({ type: 'UPDATE_TRACK', payload: json })
        setTrack(emptyTrack)
        setEmptyFields([])
        setError(null)
      } else {
        setError(json.error)
        setEmptyFields(json.emptyFields)
      }
    } else {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(track)
      })
      const json = await res.json()
      if (!res.ok) {
        setEmptyFields(json.emptyFields)
        setError(json.error)
      } else {
        setError(null)
        setEmptyFields([])
        dispatch({ type: 'ADD_TRACK', payload: json })
        setTrack(emptyTrack)
      }
    }
  }

  const handleBlur = async (e) => {
    if (!track.artist && !track.title) {
      const res = await fetch('/api/tracks/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ link: e.target.value })
      })
      const json = await res.json()
      setTrack(json);
    }
  }

  return (
    <form className='create' onSubmit={handleSubmit}>
      <h3>Link form</h3>
      <div>
        <label>
          Link :
        </label>
        <input
          type="text"
          onChange={(e) => setTrack({ ...track, link: e.target.value })}
          onBlur={handleBlur}
          value={track.link}
          className={emptyFields?.includes('link') ? 'error' : ''}
        />
      </div>
      <div>
        <label>
          Artist :
        </label>
        <input
          type="text"
          onChange={(e) => setTrack({ ...track, artist: e.target.value })}
          value={track.artist}
          className={emptyFields?.includes('artist') ? 'error' : ''}
        />
      </div>
      <div>
        <label>
          Title :
        </label>
        <input
          type="text"
          onChange={(e) => setTrack({ ...track, title: e.target.value })}
          value={track.title}
          className={emptyFields?.includes('title') ? 'error' : ''}
        />
      </div>
      <button type='submit'>{track._id ? 'Update' : 'Add'} track</button>
      <button type="reset" className='cancel-button' onClick={() => setTrack(emptyTrack)}>Cancel</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
