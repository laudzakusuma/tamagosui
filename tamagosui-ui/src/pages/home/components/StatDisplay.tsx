import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

type StatDisplayProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  // === TAMBAHKAN TIPE BARU INI ===
  weatherEffect?: {
    icon: ReactNode;
    text: string;
  };
};

export function StatDisplay({ icon, label, value, weatherEffect }: StatDisplayProps) {
  const displayValue = Math.floor(value);

  let progressColorClass = "";
  if (displayValue < 30) {
    progressColorClass = "bg-red-400";
  } else if (displayValue < 70) {
    progressColorClass = "bg-yellow-400";
  } else {
    progressColorClass = "bg-green-400";
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex-shrink-0 text-slate-600 dark:text-slate-300">{icon}</div>
      <div className="relative flex-grow h-6 rounded-full bg-gray-200 dark:bg-slate-700 shadow-inner overflow-hidden">
        <Progress value={displayValue} className="h-full w-full bg-transparent" indicatorClassName={progressColorClass} />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-bold text-gray-900 dark:text-slate-900 cursor-pointer">
              {displayValue}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}: {displayValue} / 100</p>
            {weatherEffect && (
              <p className="flex items-center gap-1 mt-1 text-xs">
                {weatherEffect.icon} {weatherEffect.text}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}