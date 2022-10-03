import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (user) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      if (response.ok) {
        // save the user in the local storage
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({
          type: 'LOGIN',
          payload: data,
        });
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { login, error, loading };
}