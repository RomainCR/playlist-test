import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  console.log(action, state);
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        ...state,
        workouts: action.payload,
      }
    case "SET_WORKOUT":
      return {
        ...state,
        globalWorkout: action.payload,
      }
    case "ADD_WORKOUT":
      return {
        workouts: [...state.workouts, action.payload]
      };
    case "DELETE_WORKOUT":
      return {
        workouts: state.workouts.filter(workout => workout._id !== action.payload)
      }
    case "UPDATE_WORKOUT":
      const objIndex = state.workouts.findIndex((obj => obj._id === action.payload._id));
      const newWorkouts = [...state.workouts];
      newWorkouts[objIndex] = action.payload;
      return {
        workouts: newWorkouts
      };
    default:
      return state;
  }
}

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, { workouts: null, globalWorkout: null });


  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  )
}

