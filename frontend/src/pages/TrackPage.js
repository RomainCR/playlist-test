import React, { useEffect, useState } from 'react'
import { TrackDetails } from '../components/TrackDetails'
import { TrackForm } from '../components/TrackForm'
import { useTracksContext } from '../hooks/useTracksContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const TrackPage = () => {
  const { dispatch, tracks } = useTracksContext()
  const { user } = useAuthContext();
  const [showPublic, setShowPublic] = useState(false)

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch('/api/tracks', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        dispatch({ type: 'SET_TRACKS', payload: json });
      }
    }
    if (user) {
      fetchTracks();
    }
  }, [dispatch, user])

  return (
    <div className='home'>
      <div className='tracks'>
        <TrackForm />
        {tracks && tracks.filter(w => showPublic ? w : !w.is_public).map(track => (
          <TrackDetails key={track._id} track={track} />
        ))}
      </div>
    </div>
  )
}
