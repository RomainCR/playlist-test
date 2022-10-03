import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { Link } from 'react-router-dom'

export const Signup = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const { signup, error, loading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(user)
  };

  return (
    <form className='signup' onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <label htmlFor='password'>Password</label>
      <input
        type='password'
        value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button type='submit' disabled={loading}>Sign up</button>
      {error && <div className='error'>{error}</div>}
      <p>Already have an account? <span><Link to='/signup'>Log in</Link></span></p>
    </form>
  )
}
