import { useEffect, useState } from "react";
import {
  CoinsIcon, HeartIcon, StarIcon, Loader2Icon, BatteryIcon,
  DrumstickIcon, PlayIcon, BedIcon, BriefcaseIcon, ZapIcon,
  ChevronUpIcon, CompassIcon, SparklesIcon, ArrowUpCircle, SunIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatDisplay } from "@/pages/home/components/StatDisplay";
import { WardrobeManager } from "@/pages/home/components/Wardrobe";
import { DreamBubble } from "@/pages/home/components/DreamBubble";
import { WeatherDisplay } from "@/pages/home/components/WeatherDisplay";
import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { useMutateBertualang } from "@/hooks/useMutateBertualang";
import type { PetStruct } from "@/types/Pet";
import type { WeatherType } from "@/pages/home/index";
import AIInteraction from "@/pages/home/components/AIInteraction";

type PetDashboardProps = { pet: PetStruct; currentWeather: WeatherType };

const AuraCountdown = ({ expiration }: { expiration: number }) => {
  const calculateTimeLeft = () => {
    const difference = expiration - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <span>
      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
};

export default function PetComponent({ pet, currentWeather }: PetDashboardProps) {
  const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
  const [displayStats, setDisplayStats] = useState(pet.stats);
  
  const EVOLUTION_LEVEL = 3;

  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
  const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();
  const { mutate: mutateBertualang, isPending: isAdventuring } = useMutateBertualang();

  const moodEmojis: { [key: string]: string } = { Happy: "😄", Sad: "😢", Neutral: "😐" };
  const isAuraActive = pet.aura !== "None" && pet.aura_expiration > Date.now();

  useEffect(() => { setDisplayStats(pet.stats); }, [pet.stats]);

  useEffect(() => {
    if (pet.isSleeping && !isWakingUp && gameBalance) {
      const intervalId = setInterval(() => {
        setDisplayStats((prev) => ({
          energy: Math.min(gameBalance.max_stat, prev.energy + (1000 / Number(gameBalance.sleep_energy_gain_ms))),
          hunger: Math.max(0, prev.hunger - (1000 / Number(gameBalance.sleep_hunger_loss_ms))),
          happiness: Math.max(0, prev.happiness - (1000 / Number(gameBalance.sleep_happiness_loss_ms))),
        }));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pet.isSleeping, isWakingUp, gameBalance]);

  if (isLoadingGameBalance || !gameBalance) {
    return (
      <div className="w-80 text-center p-8 bg-white/80 backdrop-blur-md rounded-lg animate-fade-in">
        <h2 className="text-xl font-bold">Memuat...</h2>
      </div>
    );
  }
  
  const isAnyActionPending = isFeeding || isPlaying || isWorking || isSleeping || isWakingUp || isLevelingUp || isAdventuring;
  const canFeed = !pet.isSleeping && pet.stats.hunger < gameBalance.max_stat && pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay = !pet.isSleeping && pet.stats.energy >= gameBalance.play_energy_loss && pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork = !pet.isSleeping && pet.stats.energy >= gameBalance.work_energy_loss && pet.stats.happiness >= gameBalance.work_happiness_loss && pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canAdventure = !pet.isSleeping && pet.stats.energy >= 25 && !isAuraActive;
  const canLevelUp = !pet.isSleeping && pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);
  const isReadyToEvolve = canLevelUp && (pet.game_data.level + 1) === EVOLUTION_LEVEL;
  
  const actionButtonClass = "w-full h-9 text-xs font-bold rounded-md shadow-sm border transition-transform transform hover:scale-105 active:scale-95";

  const getAuraClassName = () => {
    if (!isAuraActive) return "";
    if (pet.aura === "Coin Magnet") return "aura-coin-magnet";
    if (pet.aura === "XP Boost") return "aura-xp-boost";
    return "";
  };

  return (
    <TooltipProvider>
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="md:col-span-2 flex flex-col items-center justify-center">
            <div className="relative">
              <img src={pet.image_url} alt={pet.name} className="max-w-md w-full h-auto rounded-lg shadow-2xl animate-breathing" />
              {pet.isSleeping && <DreamBubble />}
            </div>
            <AIInteraction petName={pet.name} petPersonality={pet.personality} />
          </div>

          <div className="flex items-center justify-center">
            <Card className="relative w-80 shadow-2xl border-2 border-white/30 bg-white/20 backdrop-blur-xl rounded-xl animate-fade-in">
              <WeatherDisplay currentWeather={currentWeather} />
              <CardContent className="p-3 space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <div className={`w-24 h-24 flex-shrink-0 bg-purple-200 p-1.5 rounded-md shadow-inner transition-all duration-500 ${getAuraClassName()}`}>
                      <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover rounded-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 space-y-2">
                     <div>
                      <h2 className="text-xl font-black text-gray-800 leading-tight">{pet.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 inline-block rounded">Level {pet.game_data.level}</p>
                          <p className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 inline-flex items-center gap-1 rounded">
                            {moodEmojis[pet.mood] || "😐"}
                            <span>{pet.mood}</span>
                          </p>
                      </div>
                    </div>
                     <div className="flex justify-between items-center text-xs">
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <span className="flex items-center gap-1 font-bold bg-yellow-100 px-2 py-0.5 rounded"><CoinsIcon className="w-3 h-3 text-yellow-600" /> {pet.game_data.coins}</span>
                          </TooltipTrigger>
                          <TooltipContent><p>Koin</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <span className="flex items-center gap-1 font-bold bg-purple-100 px-2 py-0.5 rounded">{pet.game_data.experience} <StarIcon className="w-3 h-3 text-purple-600" /></span>
                           </TooltipTrigger>
                           <TooltipContent><p>Experience Points (XP)</p></TooltipContent>
                        </Tooltip>
                    </div>
                     {isAuraActive && (
                        <div className="text-xs font-bold bg-white/50 text-slate-800 px-2 py-1 rounded-md text-center">
                            <p className="flex items-center justify-center gap-1"><SparklesIcon className="w-3 h-3"/> {pet.aura}</p>
                            <p>Sisa Waktu: <AuraCountdown expiration={pet.aura_expiration} /></p>
                        </div>
                     )}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <StatDisplay 
                    icon={<BatteryIcon className="w-4 h-4 text-green-500" />} 
                    label="Energi" 
                    value={displayStats.energy}
                    weatherEffect={currentWeather === 'Rainy' ? { icon: <ArrowUpCircle className="w-3 h-3 text-green-600" />, text: 'Hemat Energi!' } : undefined}
                  />
                  <StatDisplay 
                    icon={<HeartIcon className="w-4 h-4 text-pink-500" />} 
                    label="Bahagia" 
                    value={displayStats.happiness}
                    weatherEffect={currentWeather === 'Sunny' ? { icon: <SunIcon className="w-3 h-3 text-yellow-600" />, text: 'Lebih Ceria!' } : undefined}
                  />
                  <StatDisplay 
                    icon={<DrumstickIcon className="w-4 h-4 text-orange-500" />} 
                    label="Lapar" 
                    value={displayStats.hunger} 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                   <Button onClick={() => mutateFeedPet({ petId: pet.id, petName: pet.name })} disabled={!canFeed || isAnyActionPending} className={actionButtonClass}>
                    {isFeeding ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <DrumstickIcon className="w-4 h-4"/>}
                  </Button>
                   <Button onClick={() => mutatePlayWithPet({ petId: pet.id, petName: pet.name })} disabled={!canPlay || isAnyActionPending} className={actionButtonClass}>
                    {isPlaying ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4"/>}
                  </Button>
                   <Button onClick={() => mutateWorkForCoins({ petId: pet.id, petName: pet.name })} disabled={!canWork || isAnyActionPending} className={actionButtonClass}>
                    {isWorking ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <BriefcaseIcon className="w-4 h-4"/>}
                  </Button>
                  <Button onClick={() => mutateBertualang({ petId: pet.id, petName: pet.name })} disabled={!canAdventure || isAnyActionPending} className={`${actionButtonClass} col-span-3 bg-teal-500 hover:bg-teal-600 text-white`}>
                    {isAdventuring ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <><CompassIcon className="w-4 h-4 mr-1"/>Bertualang</>}
                  </Button>
                  <Button onClick={() => pet.isSleeping ? mutateWakeUpPet({ petId: pet.id }) : mutateLetPetSleep({ petId: pet.id })} disabled={isWakingUp || isSleeping || isAnyActionPending} className={`${actionButtonClass} col-span-3 ${pet.isSleeping ? 'bg-yellow-400 hover:bg-yellow-500 animate-pulse-bg' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}>
                    {isWakingUp || isSleeping ? <Loader2Icon className="w-4 h-4 animate-spin" /> : (pet.isSleeping ? <><ZapIcon className="w-4 h-4 mr-1"/>Bangun!</> : <><BedIcon className="w-4 h-4 mr-1"/>Tidur</>)}
                  </Button>

                   <Button
                      onClick={() => mutateLevelUp({ petId: pet.id, petName: pet.name, currentLevel: pet.game_data.level })}
                      disabled={!canLevelUp || isAnyActionPending}
                      className={`${actionButtonClass} col-span-3 text-white ${ isReadyToEvolve ? 'bg-purple-600 hover:bg-purple-700 animate-pulse' : 'bg-green-500 hover:bg-green-600'} ${canLevelUp && !isReadyToEvolve && 'animate-pulse'}`} >
                      {isLevelingUp ? <Loader2Icon className="w-4 h-4 animate-spin" /> : isReadyToEvolve ? <>✨ Berevolusi!</> : <><ChevronUpIcon className="w-4 h-4 mr-1"/>Naik Level!</> }
                    </Button>
                </div>
              </CardContent>
              <WardrobeManager pet={pet} isAnyActionPending={isAnyActionPending} />
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}