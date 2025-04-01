import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

function Stats() {

  const {totalSession,totalRunningHours,powerUsage} = useContext(AppContext);

  const handleClick = async () => {
      console.log("Refresh state is : on work proccesing")
  }

  return (
    <div className='h-full pt-10 flex flex-col space-y-6'>

      {/* total session */}
      <div className=''>
        <p className='text-xl font-semibold'>Total Sessions</p>
        <p className='text-lg'>{totalSession}</p>
      </div>

      {/* total running hours */}
      <div className=''>
        <p className='text-xl font-semibold'>Total Running Hours</p>
        <p className='text-lg'>{totalRunningHours}</p>
      </div>

      {/* total power Usage */}
      <div className=''>
        <p className='text-xl font-semibold'>Power Usage</p>
        <p className='text-lg'>{powerUsage}</p>
      </div>

      <p className='text-center pt-5 font-semibold text-lg' onClick={()=>handleClick()}>Refresh Stats</p>

    </div>
  )
}

export default Stats