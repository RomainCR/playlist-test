import React, { useState, useEffect } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext';

export const WorkoutForm = () => {
  const { user } = useAuthContext();

  const { dispatch, globalWorkout } = useWorkoutsContext()
  const emptyWorkout = {
    title: '',
    load: '',
    reps: '',
    is_public: false,
  }
  const [workout, setWorkout] = useState(emptyWorkout)
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const [input, setInput] = useState('123 rue Duguesclin')
  const [list, setList] = useState([])

  useEffect(() => {
    if (globalWorkout) {
      setWorkout(globalWorkout)
    }
  }, [globalWorkout])

  const renderList = response => {
    if (response?.features) {
      return response.features.map(feature => {
        return {
          ...feature.properties
        }
      })
    }
  }

  useEffect(() => {
    // console.log("oui")

    const fetchAdd = async () => {
      await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input}&type=housenumber&autocomplete=1`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const updatedList = renderList(data)
          setList(updatedList)
        }).catch(error => setError(error))
    }
    fetchAdd()
  }, [input])

  // console.log(workout)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create a workout')
      return
    }
    if (workout._id) {
      console.log("workout", workout)
      const res = await fetch(`/api/workouts/${workout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`

        },
        body: JSON.stringify(workout),
      })
      const json = await res.json()
      if (res.ok) {
        dispatch({ type: 'UPDATE_WORKOUT', payload: json })
        setWorkout(emptyWorkout)
        setEmptyFields([])
        setError(null)
      } else {
        setError(json.error)
        setEmptyFields(json.emptyFields)
      }
    } else {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(workout)
      })
      const json = await res.json()
      if (!res.ok) {
        setEmptyFields(json.emptyFields)
        setError(json.error)
      } else {
        setError(null)
        setEmptyFields([])
        dispatch({ type: 'ADD_WORKOUT', payload: json })
        setWorkout(emptyWorkout)
      }
    }
  }

  return (
    <form className='create' onSubmit={handleSubmit}>
      <h3>Workout Form</h3>
      <div>
        <label>
          Exercise :
        </label>
        <input
          type="text"
          onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
          value={workout.title}
          className={emptyFields?.includes('title') ? 'error' : ''}
        />
      </div>
      <div>
        <label>
          load :
        </label>
        <input
          type="number"
          onChange={(e) => setWorkout({ ...workout, load: e.target.value })}
          value={workout.load}
          className={emptyFields?.includes('load') ? 'error' : ''}
        />
      </div>
      <div>
        <label>
          reps :
        </label>
        <input
          type="number"
          onChange={(e) => setWorkout({ ...workout, reps: e.target.value })}
          value={workout.reps}
          className={emptyFields?.includes('reps') ? 'error' : ''}
        />
      </div>
      {/* <div>
        <label>
          adresse :
        </label>
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className={emptyFields?.includes('reps') ? 'error' : ''}
        />
      </div>
      <pre>
        {JSON.stringify(list, null, 2)}
      </pre> */}
      <div className='checkbox'>
        <label for="public">Public</label>
        <input
          type="checkbox"
          id="public"
          name="public"
          value={workout.is_public}
          onChange={() => setWorkout((prev) => ({ ...prev, is_public: !prev.is_public }))}
        />
      </div>
      <button type='submit'>{workout._id ? 'Update' : 'Add'} workout</button>
      <button type="reset" className='cancel-button' onClick={() => setWorkout(emptyWorkout)}>Cancel</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
