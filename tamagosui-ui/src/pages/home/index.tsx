import { useState, useEffect } from "react";
import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";

// Definisikan tipe dan urutan cuaca
export type WeatherType = 'Sunny' | 'Cloudy' | 'Rainy';
const weatherCycle: WeatherType[] = ['Sunny', 'Cloudy', 'Rainy'];

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();
  
  // State untuk menyimpan cuaca saat ini
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('Sunny');

  useEffect(() => {
    // Timer untuk mengganti cuaca setiap 1 menit
    const weatherTimer = setInterval(() => {
      setCurrentWeather(prevWeather => {
        const currentIndex = weatherCycle.indexOf(prevWeather);
        const nextIndex = (currentIndex + 1) % weatherCycle.length;
        return weatherCycle[nextIndex];
      });
    }, 60000); // Ganti cuaca setiap 60 detik

    return () => clearInterval(weatherTimer); // Bersihkan timer saat komponen unmount
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animated-gradient-background -z-10"></div>
      <Header />
      <main className="w-full h-full flex items-center justify-center pt-20">
        {!currentAccount ? (
          <div className="text-center p-8 rounded-xl shadow-2xl bg-white/80 backdrop-blur-md animate-float">
            <h2 className="text-2xl font-bold uppercase text-gray-800">
              Please Connect Wallet
            </h2>
          </div>
        ) : isOwnedPetLoading ? (
          <div className="text-center p-8 rounded-xl shadow-2xl bg-white/80 backdrop-blur-md animate-float">
            <h2 className="text-2xl font-bold uppercase text-gray-800">
              Loading Pet...
            </h2>
          </div>
        ) : ownedPet ? (
          // Teruskan cuaca saat ini ke PetComponent
          <PetComponent pet={ownedPet} currentWeather={currentWeather} />
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}