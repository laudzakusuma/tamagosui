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

const mutateKeyBertualang = ["mutate", "bertualang"];

// === PERBAIKAN: Tambahkan petName ke tipe data ===
type UseMutateBertualangParams = {
  petId: string;
  petName: string; 
};

export function useMutateBertualang() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyBertualang,
    mutationFn: async ({ petId }: UseMutateBertualangParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::bertualang`,
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
    // === PERBAIKAN: Perbarui onSuccess untuk notifikasi yang lebih baik ===
    onSuccess: (response, { petName }) => {
      toast.success(
        `Petualangan ${petName} berhasil! Aura kekuatan didapatkan!`,
        {
          description: `Tx: ${response.digest.slice(0, 10)}...`,
        },
      );
      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error) => {
      console.error("Error adventuring:", error);
      toast.error(`Petualangan gagal: ${error.message}`);
    },
  });
}