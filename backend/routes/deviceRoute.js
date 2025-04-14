import express from 'express';
import {
  setSessionTime,
  startSession,
  startSanitation,
  setUserFan,
  setMachineFan,
  exportLightHistory,
  resetStats,
  stopSession,
  setMaxUserTemp,
  setMaxMachineTemp,
  pauseSessionTime,
  resumeSessionTime,
  resumeSanitation,
  pauseSanitation,
  stopSanitation,
} from '../controller/deviceController.js';

const deviceRouter = express.Router();

deviceRouter.post('/session', setSessionTime);         // Set session time
deviceRouter.post('/session/start', startSession);     // Start session
deviceRouter.post('/pause',pauseSessionTime)            // pause session time
deviceRouter.post('/resume',resumeSessionTime)            // resume session time
deviceRouter.post('/session/stop', stopSession); // Stop session

deviceRouter.post('/sanitation/start', startSanitation); // Start sanitation
deviceRouter.post('/sanitation/resume', resumeSanitation); // resume sanitation
deviceRouter.post('/sanitation/pause', pauseSanitation); // pause sanitation
deviceRouter.post('/sanitation/stop', stopSanitation); // pause sanitation


deviceRouter.post('/fan/user', setUserFan);            // Set user fan
deviceRouter.post('/fan/machine', setMachineFan);      // Set machine fan
deviceRouter.post('/user-maxtemp', setMaxUserTemp);      // Set max user temp
deviceRouter.post('/machine-maxtemp', setMaxMachineTemp);      // Set max machine temp

deviceRouter.get('/export/light-history', exportLightHistory); // Export
deviceRouter.post('/reset-stats', resetStats);         // Reset stats

export default deviceRouter;
