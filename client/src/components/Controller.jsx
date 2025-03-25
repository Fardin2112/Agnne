import React from 'react'
import LeftController from './LeftController'
import RightController from './RightController'

function Controller() {
  return (
    <div className='h-[80%] flex'>
        <div className='w-[60%]'>
           <LeftController/>
        </div>
        <div className='w-[40%] bg-pink-400'>
        <RightController/>
        </div>
        
    </div>
  )
}

export default Controller