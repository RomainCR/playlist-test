import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar'
import { TrackPage } from './pages/TrackPage'
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route path='/link' element={user ? <TrackPage /> : <Navigate to='/login' />} />
            <Route path='/' element=
              {
                user ? <Home /> : <Navigate to='/login' />
              }
            />

            <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
            <Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
            {/* <Route path='/about' element={<About />} /> */}
          </Routes>
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
