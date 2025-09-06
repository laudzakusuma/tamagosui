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
      className="w-full bg-primary hover:bg-primary/80 text-white font-bold rounded-xl py-6 text-lg shadow-md transition-all duration-300 transform hover:scale-105"
    >
      {isPending ? (
        <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {label}
    </Button>
  );
}