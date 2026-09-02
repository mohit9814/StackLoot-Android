import React, { useState } from 'react';
import { Users, Plus, Check, X } from 'lucide-react';
import type { UserProfile, CreateProfileParams } from '../../types/profile';
import { hapticsService } from '../../services/hapticsService';

interface ProfilePickerModalProps {
  isOpen: boolean;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (params: CreateProfileParams) => void;
  onClose: () => void;
}

const AVATARS = ['🚀', '💎', '🦁', '⚡', '🎮', '🎸', '👑', '🔥'];

export const ProfilePickerModal: React.FC<ProfilePickerModalProps> = ({
  isOpen,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onClose,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🚀');

  if (!isOpen) return null;

  const handleSelect = async (id: string) => {
    await hapticsService.impactLight();
    onSelectProfile(id);
    onClose();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await hapticsService.notifySuccess();
    onCreateProfile({
      teenName: newName.trim(),
      avatarEmoji: selectedEmoji,
    });
    setNewName('');
    setIsCreating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 text-amber-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Family Profiles</h3>
              <p className="text-[11px] text-zinc-400">Switch kid profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCreating ? (
          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Child's Name</label>
              <input
                type="text"
                placeholder="e.g. Diya"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                autoFocus
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Choose Avatar</label>
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all cursor-pointer ${
                      selectedEmoji === emoji
                        ? 'bg-amber-400/20 border-amber-400 scale-105'
                        : 'bg-zinc-950 border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                Save Kid
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isSelected = p.id === activeProfileId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 shadow-sm'
                        : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{p.avatarEmoji || '🚀'}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">{p.teenName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {p.activePlan ? 'Active Vault Plan' : 'Pending Vault Plan'}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer mt-1"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Another Kid Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
