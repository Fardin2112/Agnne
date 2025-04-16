import React from 'react'
import LeftController from './LeftController'
import RightController from './RightController'

function Controller() {
  return (
    <div className='h-full w-full flex'>
        <div className='w-[50%]'>
           <LeftController/>
        </div>
        <div className='w-[50%]'>
           <RightController/>
        </div>
        
    </div>
  )
}

export default Controller