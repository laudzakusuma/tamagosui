import { SunIcon, CloudIcon, CloudRainIcon } from 'lucide-react';
import type { WeatherType } from '../index'; // Kita akan membuat tipe ini di langkah berikutnya

type WeatherDisplayProps = {
  currentWeather: WeatherType;
};

const weatherInfo = {
  Sunny: {
    icon: <SunIcon className="w-6 h-6 text-yellow-500" />,
    text: "Cerah",
    description: "Pet Anda merasa lebih bahagia di bawah sinar matahari!",
  },
  Cloudy: {
    icon: <CloudIcon className="w-6 h-6 text-gray-500" />,
    text: "Berawan",
    description: "Cuaca yang tenang dan biasa saja.",
  },
  Rainy: {
    icon: <CloudRainIcon className="w-6 h-6 text-blue-500" />,
    text: "Hujan",
    description: "Waktu yang tepat untuk bersantai! Energi lebih hemat.",
  },
};

export const WeatherDisplay = ({ currentWeather }: WeatherDisplayProps) => {
  const info = weatherInfo[currentWeather];

  return (
    <div className="absolute top-3 right-3 bg-white/50 backdrop-blur-md p-2 rounded-full flex items-center gap-2 shadow-md animate-fade-in">
      {info.icon}
    </div>
  );
};