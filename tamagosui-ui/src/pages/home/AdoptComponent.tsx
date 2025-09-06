import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
    <div className="w-full max-w-sm relative overflow-hidden rounded-lg shadow-lg animated-gradient-background">
      <Card className="bg-card/90 border-none w-full h-full p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">ADOPSI PET-MU</CardTitle>
          <CardDescription>Teman barumu menunggu!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <img
              src={INTIAAL_PET_IMAGE_URL}
              alt="Your new pet"
              className="w-40 h-40 mx-auto image-rendering-pixelated bg-secondary p-2 border-2 border-primary rounded-full animate-float"
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg">Siapa namanya?</p>
            <Input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Masukkan nama pet"
              disabled={isAdopting}
              className="text-center text-lg border-2 border-primary focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            />
          </div>

          <div>
            <Button
              onClick={handleAdoptPet}
              disabled={!petName.trim() || isAdopting}
              className="w-full text-lg py-6 border-2 border-primary shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 transform transition-transform hover:scale-105"
            >
              {isAdopting ? (
                <>
                  <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Mengadopsi...
                </>
              ) : (
                "ADOPSI SEKARANG"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}