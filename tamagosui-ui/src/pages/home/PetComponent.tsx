import { useEffect, useState } from "react";
import {
  CoinsIcon,
  HeartIcon,
  StarIcon,
  Loader2Icon,
  BatteryIcon,
  DrumstickIcon,
  PlayIcon,
  BedIcon,
  BriefcaseIcon,
  ZapIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatDisplay } from "./components/StatDisplay";
import { WardrobeManager } from "./components/Wardrobe";
import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import type { PetStruct } from "@/types/Pet";

type PetDashboardProps = { pet: PetStruct };

export default function PetComponent({ pet }: PetDashboardProps) {
  const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
  const [displayStats, setDisplayStats] = useState(pet.stats);

  // Hooks untuk aksi... (tidak ada perubahan di sini)
  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
  const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();

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
  
  const isAnyActionPending = isFeeding || isPlaying || isWorking || isSleeping || isWakingUp || isLevelingUp;
  const canFeed = !pet.isSleeping && pet.stats.hunger < gameBalance.max_stat && pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay = !pet.isSleeping && pet.stats.energy >= gameBalance.play_energy_loss && pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork = !pet.isSleeping && pet.stats.energy >= gameBalance.work_energy_loss && pet.stats.happiness >= gameBalance.work_happiness_loss && pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canLevelUp = !pet.isSleeping && pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);

  const actionButtonClass = "w-full h-9 text-xs font-bold rounded-md shadow-sm border transition-transform transform hover:scale-105";


  return (
    <TooltipProvider>
      <div className="animate-float">
        <Card className="w-80 shadow-lg border-2 border-white/30 bg-white/80 backdrop-blur-lg rounded-xl animate-fade-in">
          <CardContent className="p-3 space-y-3">
            {/* Top Section */}
            <div className="flex gap-3 items-center">
              <div className="w-24 h-24 flex-shrink-0 bg-purple-200 p-1.5 rounded-md shadow-inner">
                <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover rounded-sm" />
              </div>
              <div className="flex flex-col flex-1 space-y-2">
                <div>
                  <h2 className="text-xl font-black text-gray-800 leading-tight">{pet.name}</h2>
                  <p className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 inline-block rounded">Level {pet.game_data.level}</p>
                </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 font-bold bg-yellow-100 px-2 py-0.5 rounded"><CoinsIcon className="w-3 h-3 text-yellow-600" /> {pet.game_data.coins}</span>
                    <span className="flex items-center gap-1 font-bold bg-purple-100 px-2 py-0.5 rounded">{pet.game_data.experience} <StarIcon className="w-3 h-3 text-purple-600" /></span>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="space-y-1.5">
              <StatDisplay icon={<BatteryIcon className="w-4 h-4 text-green-500" />} label="Energi" value={displayStats.energy} />
              <StatDisplay icon={<HeartIcon className="w-4 h-4 text-pink-500" />} label="Bahagia" value={displayStats.happiness} />
              <StatDisplay icon={<DrumstickIcon className="w-4 h-4 text-orange-500" />} label="Lapar" value={displayStats.hunger} />
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
               <Button onClick={() => mutateFeedPet({ petId: pet.id })} disabled={!canFeed || isAnyActionPending} className={actionButtonClass}>
                {isFeeding ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <DrumstickIcon className="w-4 h-4"/>}
              </Button>
               <Button onClick={() => mutatePlayWithPet({ petId: pet.id })} disabled={!canPlay || isAnyActionPending} className={actionButtonClass}>
                {isPlaying ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4"/>}
              </Button>
               <Button onClick={() => mutateWorkForCoins({ petId: pet.id })} disabled={!canWork || isAnyActionPending} className={actionButtonClass}>
                {isWorking ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <BriefcaseIcon className="w-4 h-4"/>}
              </Button>

              <Button onClick={() => pet.isSleeping ? mutateWakeUpPet({ petId: pet.id }) : mutateLetPetSleep({ petId: pet.id })} disabled={isWakingUp || isSleeping} className={`${actionButtonClass} col-span-3 ${pet.isSleeping ? 'bg-yellow-400 hover:bg-yellow-500 animate-pulse-bg' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}>
                {isWakingUp || isSleeping ? <Loader2Icon className="w-4 h-4 animate-spin" /> : (pet.isSleeping ? <><ZapIcon className="w-4 h-4 mr-1"/>Bangun!</> : <><BedIcon className="w-4 h-4 mr-1"/>Tidur</>)}
              </Button>

               <Button onClick={() => mutateLevelUp({ petId: pet.id })} disabled={!canLevelUp || isAnyActionPending} className={`${actionButtonClass} col-span-3 bg-green-500 hover:bg-green-600 text-white ${canLevelUp && 'animate-pulse'}`}>
                {isLevelingUp ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <><ChevronUpIcon className="w-4 h-4 mr-1"/>Naik Level!</>}
              </Button>
            </div>
          </CardContent>
          <WardrobeManager pet={pet} isAnyActionPending={isAnyActionPending} />
        </Card>
      </div>
    </TooltipProvider>
  );
}