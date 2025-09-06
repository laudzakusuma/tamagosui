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
import { ActionButton } from "./components/ActionButton";
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

  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
  const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();

  useEffect(() => {
    setDisplayStats(pet.stats);
  }, [pet.stats]);

  useEffect(() => {
    if (pet.isSleeping && !isWakingUp && gameBalance) {
      const intervalId = setInterval(() => {
        setDisplayStats((prev) => {
          const energyPerSecond = 1000 / Number(gameBalance.sleep_energy_gain_ms);
          const hungerLossPerSecond = 1000 / Number(gameBalance.sleep_hunger_loss_ms);
          const happinessLossPerSecond = 1000 / Number(gameBalance.sleep_happiness_loss_ms);
          return {
            energy: Math.min(gameBalance.max_stat, prev.energy + energyPerSecond),
            hunger: Math.max(0, prev.hunger - hungerLossPerSecond),
            happiness: Math.max(0, prev.happiness - happinessLossPerSecond),
          };
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pet.isSleeping, isWakingUp, gameBalance]);

  if (isLoadingGameBalance || !gameBalance) {
    return (
      <div className="animate-float text-center p-8 shadow-2xl bg-white/80 backdrop-blur-md rounded-none">
        <h2 className="text-2xl font-bold text-gray-800">Memuat Aturan Game...</h2>
      </div>
    );
  }

  const isAnyActionPending =
    isFeeding || isPlaying || isWorking || isSleeping || isWakingUp || isLevelingUp;
  const canFeed =
    !pet.isSleeping &&
    pet.stats.hunger < gameBalance.max_stat &&
    pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay =
    !pet.isSleeping &&
    pet.stats.energy >= gameBalance.play_energy_loss &&
    pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork =
    !pet.isSleeping &&
    pet.stats.energy >= gameBalance.work_energy_loss &&
    pet.stats.happiness >= gameBalance.work_happiness_loss &&
    pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canLevelUp =
    !pet.isSleeping &&
    pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);

  return (
    <TooltipProvider>
      <div className="animate-float">
        <Card className="w-80 min-h-[600px] shadow-2xl border-4 border-white/60 bg-white/90 backdrop-blur-lg overflow-hidden rounded-none">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-6 h-60 flex flex-col items-center justify-center">
              <img
                src={pet.image_url}
                alt={pet.name}
                className="w-32 h-32 border-4 border-white object-cover shadow-xl bg-white/20 rounded-none"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 text-lg font-black shadow-lg transform translate-y-1/2 border-2 border-white/30 rounded-none">
                Level {pet.game_data.level}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8 space-y-6">
              <h2 className="text-3xl font-black text-gray-800 text-center -mt-2 mb-6">
                {pet.name}
              </h2>

              {/* Stats box */}
              <div className="p-5 bg-gradient-to-br from-white/60 to-white/80 space-y-4 shadow-lg border-2 border-white/40 rounded-none">
                <div className="flex justify-around items-center text-lg mb-4">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-2 font-black text-xl text-gray-800 bg-yellow-100 px-3 py-2 rounded-none">
                      <CoinsIcon className="w-6 h-6 text-yellow-600" />
                      {pet.game_data.coins}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Koin</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-2 font-black text-xl text-gray-800 bg-purple-100 px-3 py-2 rounded-none">
                      {pet.game_data.experience}
                      <StarIcon className="w-6 h-6 text-purple-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>XP</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  <StatDisplay
                    icon={<BatteryIcon className="text-green-600" />}
                    label="Energi"
                    value={displayStats.energy}
                  />
                  <StatDisplay
                    icon={<HeartIcon className="text-pink-600" />}
                    label="Bahagia"
                    value={displayStats.happiness}
                  />
                  <StatDisplay
                    icon={<DrumstickIcon className="text-orange-600" />}
                    label="Lapar"
                    value={displayStats.hunger}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => mutateLevelUp({ petId: pet.id })}
                  disabled={!canLevelUp || isAnyActionPending}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-6 text-lg shadow-lg transition-transform hover:scale-105 border-2 border-white/30 rounded-none"
                >
                  {isLevelingUp ? (
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ChevronUpIcon className="mr-2 h-5 w-5" />
                  )}
                  Naik Level!
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <ActionButton
                    onClick={() => mutateFeedPet({ petId: pet.id })}
                    disabled={!canFeed || isAnyActionPending}
                    isPending={isFeeding}
                    label="Makan"
                    icon={<DrumstickIcon className="w-5 h-5" />}
                  />
                  <ActionButton
                    onClick={() => mutatePlayWithPet({ petId: pet.id })}
                    disabled={!canPlay || isAnyActionPending}
                    isPending={isPlaying}
                    label="Main"
                    icon={<PlayIcon className="w-5 h-5" />}
                  />
                </div>

                <ActionButton
                  onClick={() => mutateWorkForCoins({ petId: pet.id })}
                  disabled={!canWork || isAnyActionPending}
                  isPending={isWorking}
                  label="Bekerja"
                  icon={<BriefcaseIcon className="w-5 h-5" />}
                />

                {pet.isSleeping ? (
                  <Button
                    onClick={() => mutateWakeUpPet({ petId: pet.id })}
                    disabled={isWakingUp}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-6 text-lg shadow-lg transition-transform hover:scale-105 border-2 border-white/30 rounded-none"
                  >
                    {isWakingUp ? (
                      <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ZapIcon className="mr-2 h-5 w-5" />
                    )}
                    Bangun!
                  </Button>
                ) : (
                  <Button
                    onClick={() => mutateLetPetSleep({ petId: pet.id })}
                    disabled={isAnyActionPending}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black py-6 text-lg shadow-lg transition-transform hover:scale-105 border-2 border-white/30 rounded-none"
                  >
                    {isSleeping ? (
                      <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <BedIcon className="mr-2 h-5 w-5" />
                    )}
                    Tidur
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <WardrobeManager pet={pet} isAnyActionPending={isAnyActionPending || pet.isSleeping} />
        </Card>
      </div>
    </TooltipProvider>
  );
}