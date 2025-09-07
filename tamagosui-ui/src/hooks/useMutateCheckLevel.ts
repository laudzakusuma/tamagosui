import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeyOwnedPet } from "./useQueryOwnedPet";
import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

const mutateKeyCheckAndLevelUp = ["mutate", "check-and-level-up"];

const EVOLUTION_LEVEL = 3;

type UseMutateCheckAndLevelUp = {
  petId: string;
  currentLevel: number;
  petName: string;
};

export function useMutateCheckAndLevelUp() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyCheckAndLevelUp,
    mutationFn: async ({ petId }: UseMutateCheckAndLevelUp) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::check_and_level_up`,
        arguments: [tx.object(petId)],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showEvents: true },
      });
      if (response?.effects?.status.status === "failure")
        throw new Error(response.effects.status.error);

      return response;
    },
    onSuccess: (response, { petName, currentLevel }) => {
      const newLevel = currentLevel + 1;
      let toastMessage = `Selamat! ${petName} naik ke Level ${newLevel}!`;
      
      if (newLevel === EVOLUTION_LEVEL) {
        toastMessage = `✨ LUAR BIASA! ${petName} telah berevolusi! ✨`;
      }
      
      toast.success(toastMessage, {
        description: `Tx: ${response.digest.slice(0, 10)}...`,
        duration: 5000,
      });

      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error leveling up pet:", error);
      toast.error(`Gagal naik level: ${error.message}`);
    },
  });
}