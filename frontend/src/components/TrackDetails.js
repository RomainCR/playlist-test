import React from 'react'
import { useTracksContext } from '../hooks/useTracksContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const TrackDetails = ({ track }) => {
  const { user } = useAuthContext();

  const { dispatch } = useTracksContext()
  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!user) {
      return
    }
    const res = await fetch(`/api/tracks/${track._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await res.json()
    if (res.ok) {
      dispatch({ type: 'DELETE_TRACK', payload: track._id })
    } else {
      console.log(json.error)
    }
  }
  return (
    <div className='track-details' key={track._id} onClick={() => dispatch({ type: 'SET_TRACK', payload: track })}>
      <p>{track.createdAt.substring(0, 10)}</p>
      <h3>{track.title}</h3>
      <p>Artiste : {track.artist}</p>
      <button onClick={handleDelete}>DELETE</button>
    </div>
  )
}
