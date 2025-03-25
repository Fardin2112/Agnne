import React from 'react'
import LeftController from './LeftController'
import RightController from './RightController'

function Controller() {
  return (
    <div className='h-full w-full flex'>
        <div className='w-[60%]'>
           <LeftController/>
        </div>
        <div className='w-[40%]'>
        <RightController/>
        </div>
        
    </div>
  )
}

export default Controller