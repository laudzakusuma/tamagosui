import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animated-gradient-background -z-10"></div>
      <Header />
      <main className="w-full h-full flex items-center justify-center pt-20">
        {!currentAccount ? (
          <div className="text-center p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md animate-float">
            <h2 className="text-4xl font-bold uppercase text-gray-800">
              Please Connect Wallet
            </h2>
          </div>
        ) : isOwnedPetLoading ? (
          <div className="text-center p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md animate-float">
            <h2 className="text-4xl font-bold uppercase text-gray-800">
              Loading Pet...
            </h2>
          </div>
        ) : ownedPet ? (
          <PetComponent pet={ownedPet} />
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}