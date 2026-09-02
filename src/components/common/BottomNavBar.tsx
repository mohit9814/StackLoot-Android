import React from 'react';
import { Vault, TrendingUp, Target, ShieldCheck } from 'lucide-react';
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
    { id: 'SIMULATOR' as MobileTab, label: 'Growth Lab', icon: TrendingUp },
    { id: 'GOALS' as MobileTab, label: 'Goals', icon: Target },
    { id: 'PARENT_STUDIO' as MobileTab, label: 'Parent OS', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 pb-safe no-select">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
