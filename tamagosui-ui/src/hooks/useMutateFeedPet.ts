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
import { useQueryGameBalance } from "./useQueryGameBalance";

const mutateKeyFeedPet = ["mutate", "feed-pet"];

type UseMutateFeedPetParams = {
  petId: string;
  petName: string;
};

export function useMutateFeedPet() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();
  const { data: gameBalance } = useQueryGameBalance();

  return useMutation({
    mutationKey: mutateKeyFeedPet,
    mutationFn: async ({ petId }: UseMutateFeedPetParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::feed_pet`,
        arguments: [tx.object(petId), tx.object(CLOCK_ID)],
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
    onSuccess: (response, { petName }) => {
      const hungerGain = gameBalance?.feed_hunger_gain || 20;
      toast.success(
        `Yummy! Kamu memberi makan ${petName}. Hunger +${hungerGain}.`,
        {
          description: `Tx: ${response.digest.slice(0, 10)}...`,
        },
      );

      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error feeding pet:", error);
      toast.error(`Error feeding pet: ${error.message}`);
    },
  });
}