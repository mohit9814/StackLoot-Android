import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Share2, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { hapticsService } from '../../services/hapticsService';

interface ParentPairingModalProps {
  isOpen: boolean;
  inviteCode: string;
  teenName: string;
  onClose: () => void;
}

export const ParentPairingModal: React.FC<ParentPairingModalProps> = ({
  isOpen,
  inviteCode,
  teenName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pairingUrl = `http://192.168.1.10:5174/?role=TEEN&pair=${inviteCode}&teen=${encodeURIComponent(teenName)}`;

  const handleCopy = async () => {
    await hapticsService.impactLight();
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = async () => {
    await hapticsService.impactMedium();
    const text = `Hey ${teenName}! Join your StackLoot Compounding Vault: ${pairingUrl} or use Code: *${inviteCode}* to track allowance & earn 30% yield!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Pair {teenName}'s Phone</h3>
              <p className="text-[11px] text-zinc-400">Scan with phone camera</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-white p-3.5 rounded-2xl shadow-inner mx-auto max-w-[200px]">
          <QRCodeSVG value={pairingUrl} size={150} level="M" />
          <span className="text-[10px] font-bold text-zinc-700 mt-1.5 text-center">
            Point Phone Camera to Open
          </span>
        </div>

        {/* Family Code */}
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-2.5 text-center space-y-0.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            Or Enter Code in App:
          </span>
          <div className="text-xl font-black font-mono tracking-widest text-amber-400">
            {inviteCode}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-300" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>Works across Wi-Fi & Mobile Network</span>
        </div>
      </div>
    </div>
  );
};
