import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

function ErrorStop() {
    const {emergencyStop} = useContext(AppContext);
  return (
    <div>ErrorStop</div>
  )
}

export default ErrorStop