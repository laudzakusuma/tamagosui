import { Progress } from "@/components/ui/progress";

type StatDisplayProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

export function StatDisplay({ icon, label, value }: StatDisplayProps) {
  const displayValue = Math.floor(value); // Bulatkan nilai

  let progressColorClass = "";
  if (displayValue < 30) {
    progressColorClass = "bg-red-400"; // Rendah
  } else if (displayValue < 70) {
    progressColorClass = "bg-yellow-400"; // Sedang
  } else {
    progressColorClass = "bg-green-400"; // Tinggi
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex-shrink-0 text-gray-700">{icon}</div> {/* Ikon */}
      <span className="w-20 font-semibold text-gray-700">{label}:</span> {/* Label */}
      <div className="relative flex-grow h-6 rounded-full bg-gray-200 shadow-inner overflow-hidden">
        <Progress value={displayValue} className="h-full w-full bg-transparent" indicatorClassName={progressColorClass} />
        <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-bold text-gray-900">
          {displayValue}
        </span>
      </div>
    </div>
  );
}