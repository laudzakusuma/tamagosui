import { ConnectButton } from "@mysten/dapp-kit";
import { DarkModeToggle } from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-lg shadow-lg border-b border-white/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🐾</span>
          </div>
          {/* MODIFIED: Menggunakan variabel CSS untuk warna teks navbar */}
          <h1 className="text-3xl font-black tracking-tighter" style={{ color: 'var(--navbar-text)' }}>
            TAMAGOSUI
          </h1>
        </div>
        
        <div className="flex items-center gap-4"> {/* Menambahkan gap */}
          <DarkModeToggle /> {/* Tombol Dark Mode */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}