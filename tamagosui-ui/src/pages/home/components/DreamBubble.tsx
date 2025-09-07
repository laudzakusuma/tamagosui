import { useState, useEffect } from 'react';
import { DrumstickIcon, CoinsIcon, ToyBrickIcon } from 'lucide-react';

const dreamIcons = [
  <DrumstickIcon key="food" className="w-8 h-8 text-orange-500" />,
  <CoinsIcon key="coins" className="w-8 h-8 text-yellow-500" />,
  <ToyBrickIcon key="play" className="w-8 h-8 text-blue-500" />,
];

export const DreamBubble = () => {
  const [currentDreamIndex, setCurrentDreamIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDreamIndex((prevIndex) => (prevIndex + 1) % dreamIcons.length);
    }, 3000); // Ganti mimpi setiap 3 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute -top-4 -right-12 z-10">
      <div className="relative w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
        <div className="animate-dream-fade">
          {dreamIcons[currentDreamIndex]}
        </div>
        {/* Titik-titik gelembung pikiran */}
        <div className="absolute -bottom-3 -left-2 w-4 h-4 bg-white/80 rounded-full border-2 border-white/50"></div>
        <div className="absolute -bottom-5 left-2 w-2 h-2 bg-white/80 rounded-full border-2 border-white/50"></div>
      </div>
    </div>
  );
};