import { useState, useEffect } from "react";
import { CoinsIcon, DrumstickIcon, PlayIcon } from "lucide-react";

const dreamIcons = [
  <DrumstickIcon key="food" className="w-8 h-8 text-orange-500" />,
  <CoinsIcon key="coins" className="w-8 h-8 text-yellow-500" />,
  <PlayIcon key="play" className="w-8 h-8 text-pink-500" />,
];

export const DreamBubble = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % dreamIcons.length);
    }, 2000); // Ganti ikon setiap 2 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Gelembung Mimpi */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full border-2 border-blue-200 animate-float"></div>
        {/* Ikon di dalam gelembung */}
        <div className="absolute inset-0 flex items-center justify-center animate-dream-fade">
          {dreamIcons[currentIconIndex]}
        </div>
         {/* Ekor gelembung */}
        <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white/80 backdrop-blur-sm rounded-full border-2 border-blue-200"></div>
        <div className="absolute -bottom-1 left-8 w-2 h-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-blue-200"></div>
      </div>
    </div>
  );
};