import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2Icon, GlassesIcon } from "lucide-react";
import { useMutateMintAccessory } from "@/hooks/useMutateMintAccessory";
import { UseMutateEquipAccessory } from "@/hooks/useMutateEquipAccessory";
import { UseMutateUnequipAccessory } from "@/hooks/useMutateUnequipAccessory";
import { useQueryOwnedAccessories } from "@/hooks/useQueryOwnedAccessories";
import { useQueryEquippedAccessory } from "@/hooks/useQueryEquippedAccessory";
import type { PetStruct } from "@/types/Pet";

type WardrobeManagerProps = {
  pet: PetStruct;
  isAnyActionPending: boolean;
};

export function WardrobeManager({ pet, isAnyActionPending }: WardrobeManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: ownedAccessories, isLoading: isLoadingAccessories } = useQueryOwnedAccessories();
  const { data: equippedAccessory, isLoading: isLoadingEquipped } = useQueryEquippedAccessory({ petId: pet.id });
  
  const { mutate: mutateMint, isPending: isMinting } = useMutateMintAccessory();
  const { mutate: mutateEquip, isPending: isEquipping } = UseMutateEquipAccessory();
  const { mutate: mutateUnequip, isPending: isUnequipping } = UseMutateUnequipAccessory();

  const isProcessingWardrobe = isMinting || isEquipping || isUnequipping;
  const isLoading = isLoadingAccessories || isLoadingEquipped;
  
  const coolGlassesInInventory = ownedAccessories?.find(acc => acc.name === 'cool glasses');

  const renderContent = () => {
    if (isLoading) {
      return <Loader2Icon className="h-5 w-5 animate-spin text-primary" />;
    }
    
    if (equippedAccessory) {
      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img src={equippedAccessory.image_url} alt={equippedAccessory.name} className="w-10 h-10 bg-white p-1 rounded-md border" />
            <p className="font-bold text-sm">{equippedAccessory.name}</p>
          </div>
          <Button onClick={() => mutateUnequip({ petId: pet.id })} disabled={isAnyActionPending || isProcessingWardrobe} variant="destructive" size="sm">
            {isUnequipping ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Lepas"}
          </Button>
        </div>
      );
    }

    if (coolGlassesInInventory) {
       return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img src={coolGlassesInInventory.image_url} alt={coolGlassesInInventory.name} className="w-10 h-10 bg-white p-1 rounded-md border" />
            <p className="font-bold text-sm">{coolGlassesInInventory.name}</p>
          </div>
          <Button onClick={() => mutateEquip({ petId: pet.id, accessoryId: coolGlassesInInventory.id.id })} disabled={isAnyActionPending || isProcessingWardrobe} size="sm">
            {isEquipping ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Pakai"}
          </Button>
        </div>
      );
    }
    
    return (
       <Button onClick={() => mutateMint()} disabled={isAnyActionPending || isProcessingWardrobe} className="w-full" size="sm">
        {isMinting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <GlassesIcon className="mr-2 h-4 w-4" />}
        Mint Cool Glasses
      </Button>
    )
  };

  return (
    <div className="px-6 pb-6">
      <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-1">
        <div 
          className="flex justify-between items-center p-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* MODIFIED: Menambahkan dark:text-slate-200 */}
          <h3 className="font-bold text-lg text-gray-700 dark:text-slate-200">WARDROBE</h3>
          <div className="text-gray-700 dark:text-slate-200">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
        {isOpen && (
          <div className="p-3">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}