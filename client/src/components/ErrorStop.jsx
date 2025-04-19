import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext';

function ErrorStop() {
    const {emergencyStop} = useContext(UserContext);
  return (
    <div>ErrorStop</div>
  )
}

export default ErrorStop