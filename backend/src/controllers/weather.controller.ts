import { Request, Response } from 'express';
import { config } from '../config';

const BITLIS_LAT = 38.39;
const BITLIS_LNG = 42.12;

async function fetchWeather(
  endpoint: string
): Promise<unknown> {
  const apiKey = config.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return {
      error: 'OpenWeather API key ayarlanmamis',
      demo: true,
      temp: 12,
      description: 'Parçalı bulutlu',
      city: 'Bitlis',
    };
  }

  const url =
    `https://api.openweathermap.org/data/2.5/${endpoint}` +
    `?lat=${BITLIS_LAT}&lon=${BITLIS_LNG}` +
    `&appid=${apiKey}&units=metric&lang=tr`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json();
}

export async function getCurrentWeather(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const data = await fetchWeather('weather');
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Hava durumu alinamadi',
    });
  }
}

export async function getForecast(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const data = await fetchWeather('forecast');
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Hava tahmini alinamadi',
    });
  }
}
