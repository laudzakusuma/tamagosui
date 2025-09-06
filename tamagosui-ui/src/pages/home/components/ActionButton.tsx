import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";

type ActionButtonProps = {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
  label: string;
  icon: ReactNode;
};

export function ActionButton({
  onClick,
  disabled,
  isPending,
  label,
  icon,
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-primary hover:bg-primary/80 text-white font-bold rounded-none h-9 text-sm shadow-md transition-all duration-300 transform hover:scale-105"
    >
      {isPending ? (
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {label}
    </Button>
  );
}