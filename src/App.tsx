import { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MobileHeader } from './components/common/MobileHeader';
import { BottomNavBar } from './components/common/BottomNavBar';
import { MobileVaultView } from './components/teen/MobileVaultView';
import { MobileGrowthLab } from './components/simulator/MobileGrowthLab';
import { MobileGoalsView } from './components/teen/MobileGoalsView';
import { MobileParentStudio } from './components/parent/MobileParentStudio';
import { PinGateModal } from './components/modals/PinGateModal';
import { useMobileProfiles } from './hooks/useMobileProfiles';
import { calculateCompoundSchedule } from './services/compoundEngine';
import { CURRENCIES } from './config/currencies';
import type { MobileTab } from './types/userRole';
import type { SimulationParams } from './types/allowance';
import type { UserProfile } from './types/profile';

export function App() {
  const {
    activeProfile,
    updateActiveProfileData,
    isLoading,
  } = useMobileProfiles();

  const [activeTab, setActiveTab] = useState<MobileTab>('VAULT');
  const [isPinGateOpen, setIsPinGateOpen] = useState<boolean>(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [simParams, setSimParams] = useState<SimulationParams>(() => activeProfile.simulationParams);

  const activeCurrency = CURRENCIES[activeProfile.currencyCode] || CURRENCIES.INR;

  const simulationResult = useMemo(() => {
    return calculateCompoundSchedule(simParams);
  }, [simParams]);

  const handleTabChange = (tab: MobileTab) => {
    if (tab === 'PARENT_STUDIO' && !isParentUnlocked) {
      setIsPinGateOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handlePinSuccess = () => {
    setIsParentUnlocked(true);
    setIsPinGateOpen(false);
    setActiveTab('PARENT_STUDIO');
  };

  const handleLockParent = () => {
    setIsParentUnlocked(false);
    setActiveTab('VAULT');
  };

  const handleActivatePlan = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const nowIso = new Date().toISOString();
    const updated: Partial<UserProfile> = {
      simulationParams: simParams,
      activePlan: {
        planId: `plan-${Date.now()}`,
        teenName: activeProfile.teenName,
        parentName: activeProfile.parentName,
        startDate: nowIso,
        targetTermMonths: simParams.termMonths,
        monthlyAllowance: simParams.monthlyAllowance,
        deferralPercentage: simParams.deferralPercentage,
        annualInterestRate: simParams.annualInterestRate,
        completionBonusPercentage: simParams.completionBonusPercentage,
        parentInterestMatchMultiplier: simParams.parentInterestMatchMultiplier,
        initialLumpSumDeposit: 0,
        currentBalance: 0,
        totalPrincipalContributed: 0,
        totalInterestEarned: 0,
        totalBonusesEarned: 0,
        status: 'ACTIVE',
        transactions: [],
      },
    };

    updateActiveProfileData(updated);
    setActiveTab('VAULT');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Loading StackLoot Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Mobile Top Header */}
      <MobileHeader
        profile={activeProfile}
        currency={activeCurrency}
        onOpenProfilePicker={() => {}}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {activeTab === 'VAULT' && (
          <MobileVaultView
            profile={activeProfile}
            simulation={simulationResult}
            currency={activeCurrency}
            onOpenGrowthLab={() => setActiveTab('SIMULATOR')}
          />
        )}

        {activeTab === 'SIMULATOR' && (
          <MobileGrowthLab
            params={simParams}
            onChangeParams={setSimParams}
            simulation={simulationResult}
            currency={activeCurrency}
            onActivatePlan={handleActivatePlan}
          />
        )}

        {activeTab === 'GOALS' && (
          <MobileGoalsView
            goals={activeProfile.goals}
            vaultBalance={activeProfile.activePlan?.currentBalance || 0}
            currency={activeCurrency}
            onOpenAddGoal={() => {}}
          />
        )}

        {activeTab === 'PARENT_STUDIO' && (
          <MobileParentStudio
            profile={activeProfile}
            currency={activeCurrency}
            onUpdatePlan={(updated) => updateActiveProfileData(updated)}
            onLockSession={handleLockParent}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

      {/* PIN Security Gate Modal for Parent Studio */}
      <PinGateModal
        isOpen={isPinGateOpen}
        onSuccess={handlePinSuccess}
        onClose={() => setIsPinGateOpen(false)}
      />
    </div>
  );
}

export default App;
