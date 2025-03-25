import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Controller from '../components/Controller'

function Home() {
  return (
    <div className='bg-black h-screen w-full'>
        <Navbar/>
        <Controller/>
        <Footer/>
    </div>
  )
}

export default Home