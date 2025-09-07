import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';

const CHEST_CLOSED_URL = 'https://img.icons8.com/plasticine/200/treasure-chest.png';
const CHEST_OPEN_URL = 'https://img.icons8.com/plasticine/200/coins.png';

type TreasureHuntProps = {
  onClaim: () => void;
  onClose: () => void;
};

export const TreasureHunt = ({ onClaim, onClose }: TreasureHuntProps) => {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  const handleChestClick = (index: number) => {
    if (isClaimed) return;
    
    setSelectedChest(index);
    setIsClaimed(true);

    setTimeout(() => {
      onClaim();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 text-center w-full max-w-md relative"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XIcon size={24} />
          </button>
          
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
            Pilih Harta Karun!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Pilih satu peti untuk mendapatkan Aura Kekuatan!
          </p>

          <div className="flex justify-around items-center gap-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="cursor-pointer"
                whileHover={{ scale: isClaimed ? 1 : 1.1 }}
                animate={ selectedChest === index ? { y: [0, -20, 0], scale: 1.2 } : {} }
                transition={{ duration: 0.5 }}
                onClick={() => handleChestClick(index)}
              >
                <img 
                  src={selectedChest === index ? CHEST_OPEN_URL : CHEST_CLOSED_URL} 
                  alt="Peti Harta Karun" 
                  className="w-24 h-24 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};