import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const WorkoutDetails = ({ workout }) => {
  const { user } = useAuthContext();

  const { dispatch } = useWorkoutsContext()
  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!user) {
      return
    }
    const res = await fetch(`/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await res.json()
    if (res.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: workout._id })
    } else {
      console.log(json.error)
    }
  }
  return (
    <div className='workout-details' key={workout._id} onClick={() => dispatch({ type: 'SET_WORKOUT', payload: workout })}>
      <p>{workout.createdAt.substring(0, 10)}</p>
      <h3>{workout.title}</h3>
      <p>LOAD : {workout.load}</p>
      <p>REPS : {workout.reps}</p>
      <button onClick={handleDelete}>DELETE</button>
    </div>
  )
}
