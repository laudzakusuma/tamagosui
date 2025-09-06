import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutateAdoptPet } from "@/hooks/useMutateAdoptPet";
import { Loader2Icon } from "lucide-react";

const INTIAAL_PET_IMAGE_URL =
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
      <Card className="w-80 h-[500px] shadow-2xl border-4 border-white/60 bg-white/90 backdrop-blur-lg overflow-hidden rounded-none">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-6 h-60 flex flex-col items-center justify-center">
            <img
              src={INTIAAL_PET_IMAGE_URL}
              alt="Your new pet"
              className="w-32 h-32 image-rendering-pixelated bg-white/80 p-3 border-4 border-white shadow-xl rounded-none"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-bold shadow-lg transform translate-y-1/2 border-2 border-white/30 rounded-none">
              Pet Baru!
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-6 space-y-6 flex flex-col justify-between">
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-black text-gray-800">
                ADOPSI PET-MU
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 font-medium">
                Teman barumu menunggu!
              </CardDescription>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-700 mb-3">
                  Siapa namanya?
                </p>
                <Input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Masukkan nama pet"
                  disabled={isAdopting}
                  className="text-center text-lg p-4 border-3 border-purple-300 focus:ring-4 focus:ring-purple-400 focus:ring-offset-2 bg-white/80 shadow-lg text-gray-800 font-medium rounded-none"
                />
              </div>

              <Button
                onClick={handleAdoptPet}
                disabled={!petName.trim() || isAdopting}
                className="w-full text-xl py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30 rounded-none"
              >
                {isAdopting ? (
                  <>
                    <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />
                    Mengadopsi...
                  </>
                ) : (
                  "ADOPSI SEKARANG"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}