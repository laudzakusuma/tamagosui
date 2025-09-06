import { Progress } from "@/components/ui/progress";

type StatDisplayProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

export function StatDisplay({ icon, label, value }: StatDisplayProps) {
  const displayValue = Math.floor(value);

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-4 h-4 flex-shrink-0" title={label}>{icon}</div>
      <div className="relative flex-grow h-4 rounded-full bg-gray-200 shadow-inner overflow-hidden border">
        <Progress value={displayValue} className="h-full" />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference">
          {displayValue} / 100
        </span>
      </div>
    </div>
  );
}