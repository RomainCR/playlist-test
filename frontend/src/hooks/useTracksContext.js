import { useContext } from 'react';
import { TracksContext } from '../context/TracksContext';

export const useTracksContext = () => {
  const context = useContext(TracksContext);

  if (!context) {
    throw new Error('useTracksContext must be used within a TracksContextProvider');
  }

  return context;
}  