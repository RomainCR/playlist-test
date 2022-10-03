import React, { useEffect, useState } from 'react'
import { WorkoutDetails } from '../components/WorkoutDetails'
import { WorkoutForm } from '../components/WorkoutForm'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const Home = () => {
  const { dispatch, workouts } = useWorkoutsContext()
  const { user } = useAuthContext();
  const [showPublic, setShowPublic] = useState(false)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      }
    }
    if (user) {
      fetchWorkouts();
    }
    const fetchAdd = async () => {
      const res = await fetch('https://api-adresse.data.gouv.fr/search/?q=26%20Rue%20Saint%20Gervais%2069008%20Lyon&type=housenumber&autocomplete=1', {
      });
      const json = await res.json();
      console.log(json)
    }
    if (user) {
      fetchAdd();
    }
  }, [dispatch, user])

  return (
    <div className='home'>
      <div className='workouts'>
        <div className='checkbox'>
          <label for="public">Show public</label>
          <input
            type="checkbox"
            id="public"
            name="public"
            value={showPublic}
            onChange={() => setShowPublic((prev) => !prev)}
          />
        </div>
        {workouts && workouts.filter(w => showPublic ? w : !w.is_public).map(workout => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}
