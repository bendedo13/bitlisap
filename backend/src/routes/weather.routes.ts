import { Router } from 'express';
import {
  getCurrentWeather,
  getForecast,
} from '../controllers/weather.controller';

const router = Router();

router.get('/', getCurrentWeather);
router.get('/forecast', getForecast);

export default router;
