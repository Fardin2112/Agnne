import React, { useContext } from 'react'
import Controller from '../components/Controller'
import LandingPage from '../components/LandingPage'
import { AppContext } from '../context/AppContext';

function Home() {

  const {toggleHome,setToggleHome} = useContext(AppContext);

  return (
    <div className='h-full w-full'>
      { !toggleHome 
      ? <LandingPage/>
      : <Controller/>
      }
      

    </div>
  )
}

export default Home