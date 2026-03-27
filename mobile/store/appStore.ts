import { create } from 'zustand';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface AppState {
  unreadNotifications: number;
  weatherData: WeatherData | null;
  pushToken: string | null;
  setUnreadCount: (count: number) => void;
  setWeatherData: (data: WeatherData) => void;
  setPushToken: (token: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  unreadNotifications: 0,
  weatherData: null,
  pushToken: null,

  setUnreadCount: (unreadNotifications) =>
    set({ unreadNotifications }),

  setWeatherData: (weatherData) =>
    set({ weatherData }),

  setPushToken: (pushToken) =>
    set({ pushToken }),
}));
