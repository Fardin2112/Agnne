import React from 'react'
import LeftController from './LeftController'
import RightController from './RightController'

function Controller() {
  return (
    // bg-[#FFFFF]/70 bg-gray-50
    <div className='h-full w-full flex bg-gray-50'> 
      <div className='w-[60%]'>
        <LeftController />
      </div>

      {/* Vertical line divider */}
      {/* <div className='w-px bg-[#FAFAFA] border-1 border-[#F1F3F4] bg-opacity-90 backdrop-blur-md border-opacity-20 shadow-[0_4px_15px_rgba(0,0,0,0.3)] h-full'></div> */}
      <div className='w-[40%]'>
        <RightController />
      </div>
    </div>
  )
}

export default Controller
