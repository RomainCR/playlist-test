import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { Link } from 'react-router-dom'
export const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const { login, error, loading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(user)
  };

  return (
    <>
      <form className='login' onSubmit={handleSubmit}>
        <h3>Log in</h3>
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
        <div>
          <button type='submit' disabled={loading}>Log in</button>
          {error && <div className='error'>{error}</div>}
        </div>
        <p>Don't have an account? <span><Link to='/signup'>Sign up</Link></span></p>
      </form>
    </>
  )
}
