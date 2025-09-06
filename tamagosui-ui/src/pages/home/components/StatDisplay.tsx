import { Progress } from "@/components/ui/progress";

type StatDisplayProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

export function StatDisplay({ icon, label, value }: StatDisplayProps) {
  const displayValue = Math.floor(value); 

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
      {/* MODIFIED: Mengganti text-gray-700 menjadi text-slate-600 untuk kontras lebih baik */}
      <div className="w-6 h-6 flex-shrink-0 text-slate-600 dark:text-slate-300">{icon}</div>
      <span className="w-20 font-semibold text-slate-600 dark:text-slate-300">{label}:</span>
      <div className="relative flex-grow h-6 rounded-full bg-gray-200 dark:bg-slate-700 shadow-inner overflow-hidden">
        <Progress value={displayValue} className="h-full w-full bg-transparent" indicatorClassName={progressColorClass} />
        <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-bold text-gray-900 dark:text-slate-900">
          {displayValue}
        </span>
      </div>
    </div>
  );
}