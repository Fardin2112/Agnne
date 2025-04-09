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
} from '../controller/deviceController.js';

const deviceRouter = express.Router();

deviceRouter.post('/session', setSessionTime);         // Set session time
deviceRouter.post('/session/start', startSession);     // Start session
deviceRouter.post('/session/stop', stopSession); // Stop session
deviceRouter.post('/sanitation/start', startSanitation); // Start sanitation
deviceRouter.post('/fan/user', setUserFan);            // Set user fan
deviceRouter.post('/fan/machine', setMachineFan);      // Set machine fan
deviceRouter.get('/export/light-history', exportLightHistory); // Export
deviceRouter.post('/reset-stats', resetStats);         // Reset stats

export default deviceRouter;
