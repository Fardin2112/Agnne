import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';

function SessionCompletePopup() {
   const {sessionComlpletePopup, setSessionCompletePopup} = useContext(AppContext);
  return (
    <div className='text-red w-full h-full'>SessionCompletePopup</div>
  )
}

export default SessionCompletePopup