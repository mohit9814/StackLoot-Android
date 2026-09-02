import React from 'react';
import { Vault, TrendingUp, Award, Target, ShieldCheck } from 'lucide-react';
import type { MobileTab } from '../../types/userRole';
import { hapticsService } from '../../services/hapticsService';

interface BottomNavBarProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const handleSelect = async (tab: MobileTab) => {
    await hapticsService.impactLight();
    onChangeTab(tab);
  };

  const navItems = [
    { id: 'VAULT' as MobileTab, label: 'Vault', icon: Vault },
    { id: 'SIMULATOR' as MobileTab, label: 'Growth', icon: TrendingUp },
    { id: 'TASKS' as MobileTab, label: 'Chores', icon: Award },
    { id: 'GOALS' as MobileTab, label: 'Wishlist', icon: Target },
    { id: 'PARENT_STUDIO' as MobileTab, label: 'Parent', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/5 px-2 py-2 pb-safe no-select">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                    : 'bg-zinc-900/60 text-zinc-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
