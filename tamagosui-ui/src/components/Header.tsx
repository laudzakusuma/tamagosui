import { ConnectButton } from "@mysten/dapp-kit";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg border-b-4 border-white/20">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🐾</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">
            TAMAGOSUI
          </h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}