import React, { useState } from 'react';
import { Users, Plus, X, Check } from 'lucide-react';
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
  const [isCreating, setIsCreating] = useState(false);
  const [newTeenName, setNewTeenName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('💎');

  if (!isOpen) return null;

  const handleSelect = async (id: string) => {
    await hapticsService.impactLight();
    onSelectProfile(id);
    onClose();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeenName.trim()) return;

    await hapticsService.notifySuccess();
    onCreateProfile({
      teenName: newTeenName.trim(),
      avatarEmoji: selectedAvatar,
    });
    setIsCreating(false);
    setNewTeenName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Family Profiles</h3>
              <p className="text-xs text-slate-400">Switch kid or add a sibling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCreating ? (
          <div className="space-y-2">
            {/* Existing Profiles List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {profiles.map((p) => {
                const isSelected = p.id === activeProfileId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{p.avatarEmoji || '🚀'}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">{p.teenName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
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
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Another Kid Profile</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Child's Name</label>
              <input
                type="text"
                placeholder="e.g. Advay or Ananya"
                value={newTeenName}
                onChange={(e) => setNewTeenName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                required
                autoFocus
              />
            </div>

            {/* Avatar Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Choose Avatar</label>
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                      selectedAvatar === av
                        ? 'bg-amber-500/20 border-amber-400 scale-110'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 rounded-xl text-xs font-black"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
