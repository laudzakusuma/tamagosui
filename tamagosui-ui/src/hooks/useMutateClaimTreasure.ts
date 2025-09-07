import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeyOwnedPet } from "./useQueryOwnedPet";
import { CLOCK_ID, MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

const mutateKeyClaimTreasure = ["mutate", "claim-treasure"];

type UseMutateClaimTreasure = {
  petId: string;
  petName: string;
};

export function useMutateClaimTreasure() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyClaimTreasure,
    mutationFn: async ({ petId }: UseMutateClaimTreasure) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::claim_treasure`,
        arguments: [tx.object(petId), tx.object(CLOCK_ID)],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showEvents: true },
      });
      if (response?.effects?.status?.status === "failure")
        throw new Error(response.effects.status.error);

      return response;
    },
    onSuccess: (response, { petName }) => {
      toast.success(
        `🎉 ${petName} menemukan Aura Kekuatan dari peti harta karun!`,
        {
          description: `Tx: ${response.digest.slice(0, 10)}...`,
          duration: 5000,
        },
      );
      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error claiming treasure:", error);
      toast.error(`Gagal mengklaim harta: ${error.message}`);
    },
  });
}