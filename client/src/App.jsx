import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Setting from './pages/Setting'
import Stats from './pages/Stats'
import Sanitation from './pages/Sanitation'
import Shutdown from './pages/Shutdown'

function App() {

  return (
    <>
    <div className='h-screen flex flex-col'>
    <Navbar />
        <div className='flex-grow overflow-auto '>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/setting' element={<Setting/>}/>
            <Route path='/stats' element={<Stats/>}/>
            <Route path='/sanitation' element={<Sanitation/>}/>
            <Route path='/shutdown' element={<Shutdown/>}/>
          </Routes> 
        </div>
      <Footer/>
    </div>
    </>
  )
}

export default App
