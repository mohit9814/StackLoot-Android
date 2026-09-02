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
    const text = `Hey ${teenName}! Join your StackLoot Compounding Vault using Family Code: *${inviteCode}* to track your allowance and earn 30% yield!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Pair {teenName}'s Phone</h3>
              <p className="text-xs text-slate-400">100% Free instant family link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-inner mx-auto max-w-[200px]">
          <QRCodeSVG
            value={`stackloot://pair?code=${inviteCode}&teen=${encodeURIComponent(teenName)}`}
            size={168}
            level="H"
            includeMargin={false}
          />
          <span className="text-[10px] font-bold text-slate-500 mt-2">
            Scan from Teen's StackLoot App
          </span>
        </div>

        {/* Family Code Pill */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Or Enter 6-Digit Family Code:
          </span>
          <div className="text-2xl font-black font-mono tracking-widest text-amber-400">
            {inviteCode}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Private end-to-end Family Vault pairing</span>
        </div>
      </div>
    </div>
  );
};
