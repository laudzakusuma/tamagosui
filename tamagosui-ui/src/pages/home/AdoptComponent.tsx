import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutateAdoptPet } from "@/hooks/useMutateAdoptPet";
import { Loader2Icon } from "lucide-react";

const INITIAL_PET_IMAGE_URL =
  "https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni";

export default function AdoptComponent() {
  const [petName, setPetName] = useState("");
  const { mutate: mutateAdoptPet, isPending: isAdopting } = useMutateAdoptPet();

  const handleAdoptPet = () => {
    if (!petName.trim()) return;
    mutateAdoptPet({ name: petName });
  };

  return (
    <div className="animate-float">
      <Card className="w-80 shadow-lg border-2 border-white/30 bg-white/80 backdrop-blur-lg rounded-xl animate-fade-in">
        <CardContent className="p-4 text-center space-y-3">
          <h2 className="text-xl font-black text-gray-800">ADOPSI PET BARU!</h2>
          <img
            src={INITIAL_PET_IMAGE_URL}
            alt="Your new pet"
            className="w-28 h-28 mx-auto image-rendering-pixelated bg-purple-100 p-2 border-2 border-white rounded-md"
          />
          <div className="space-y-2">
            <Input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Beri nama..."
              disabled={isAdopting}
              className="text-center text-md p-2 border-2 border-purple-200"
            />
            <Button
              onClick={handleAdoptPet}
              disabled={!petName.trim() || isAdopting}
              className="w-full text-md h-10 font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-md"
            >
              {isAdopting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Adopsi!"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}