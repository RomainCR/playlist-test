import { createContext, useReducer } from "react";

export const TracksContext = createContext();

export const tracksReducer = (state, action) => {
  console.log(action, state);
  switch (action.type) {
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.payload,
      }
    case "SET_TRACK":
      return {
        ...state,
        globalTrack: action.payload,
      }
    case "ADD_TRACK":
      return {
        tracks: [...state.tracks, action.payload]
      };
    case "DELETE_TRACK":
      return {
        tracks: state.tracks.filter(track => track._id !== action.payload)
      }
    case "UPDATE_TRACK":
      const objIndex = state.tracks.findIndex((obj => obj._id === action.payload._id));
      const newTracks = [...state.tracks];
      newTracks[objIndex] = action.payload;
      return {
        tracks: newTracks
      };
    default:
      return state;
  }
}

export const TracksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tracksReducer, { tracks: null, globalTrack: null });

  return (
    <TracksContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TracksContext.Provider>
  )
}

