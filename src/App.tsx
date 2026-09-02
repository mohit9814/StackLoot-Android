import { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MobileHeader } from './components/common/MobileHeader';
import { BottomNavBar } from './components/common/BottomNavBar';
import { MobileVaultView } from './components/teen/MobileVaultView';
import { MobileGrowthLab } from './components/simulator/MobileGrowthLab';
import { MobileGoalsView } from './components/teen/MobileGoalsView';
import { MobileParentStudio } from './components/parent/MobileParentStudio';
import { PinGateModal } from './components/modals/PinGateModal';
import { CurrencyPickerModal } from './components/modals/CurrencyPickerModal';
import { ProfilePickerModal } from './components/modals/ProfilePickerModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { ParentPairingModal } from './components/onboarding/ParentPairingModal';
import { TeenPairingModal } from './components/onboarding/TeenPairingModal';
import { RoleSelectionModal } from './components/onboarding/RoleSelectionModal';
import { useMobileProfiles } from './hooks/useMobileProfiles';
import { calculateCompoundSchedule } from './services/compoundEngine';
import { CURRENCIES } from './config/currencies';
import { nativeStorage } from './services/nativeStorage';
import type { MobileTab } from './types/userRole';
import type { SimulationParams, CurrencyCode } from './types/allowance';
import type { UserProfile } from './types/profile';
import type { SavingsGoal } from './types/goal';
import type { AppUserRole } from './types/pairing';

export function App() {
  const {
    profiles,
    activeProfile,
    activeProfileId,
    switchProfile,
    updateActiveProfileData,
    createNewProfile,
    isLoading,
  } = useMobileProfiles();

  const [userRole, setUserRole] = useState<AppUserRole>('TEEN');
  const [activeTab, setActiveTab] = useState<MobileTab>('VAULT');
  const [isPinGateOpen, setIsPinGateOpen] = useState<boolean>(false);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState<boolean>(false);
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState<boolean>(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isParentPairingOpen, setIsParentPairingOpen] = useState<boolean>(false);
  const [isTeenPairingOpen, setIsTeenPairingOpen] = useState<boolean>(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [simParams, setSimParams] = useState<SimulationParams>(() => activeProfile.simulationParams);

  // Load saved user role on startup
  useEffect(() => {
    nativeStorage.getUserRole().then((saved: AppUserRole) => {
      if (saved) setUserRole(saved);
    });
  }, []);

  const activeCurrency = CURRENCIES[activeProfile.currencyCode] || CURRENCIES.INR;

  const simulationResult = useMemo(() => {
    return calculateCompoundSchedule(simParams);
  }, [simParams]);

  const familyInviteCode = useMemo(() => {
    return `LOOT-${activeProfile.teenName.slice(0, 3).toUpperCase()}98`;
  }, [activeProfile.teenName]);

  const handleSelectRole = async (role: AppUserRole) => {
    setUserRole(role);
    await nativeStorage.setUserRole(role);
    if (role === 'PARENT') {
      setIsPinGateOpen(true);
    } else {
      setActiveTab('VAULT');
    }
  };

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
    setUserRole('PARENT');
    setActiveTab('PARENT_STUDIO');
  };

  const handleLockParent = () => {
    setIsParentUnlocked(false);
    setActiveTab('VAULT');
  };

  const handleSelectCurrency = (code: CurrencyCode) => {
    updateActiveProfileData({ currencyCode: code });
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    const updatedGoals = [...activeProfile.goals, newGoal];
    updateActiveProfileData({ goals: updatedGoals });
  };

  const handlePairingOpen = () => {
    if (userRole === 'PARENT' || isParentUnlocked) {
      setIsParentPairingOpen(true);
    } else {
      setIsTeenPairingOpen(true);
    }
  };

  const handleActivatePlan = () => {
    confetti({
      particleCount: 100,
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-mono">
        Loading StackLoot Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Mobile Top Header */}
      <MobileHeader
        profile={activeProfile}
        currency={activeCurrency}
        userRole={userRole}
        onOpenProfilePicker={() => setIsProfilePickerOpen(true)}
        onOpenCurrencyPicker={() => setIsCurrencyPickerOpen(true)}
        onOpenRolePicker={() => setIsRoleModalOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {activeTab === 'VAULT' && (
          <MobileVaultView
            profile={activeProfile}
            simulation={simulationResult}
            currency={activeCurrency}
            onOpenGrowthLab={() => setActiveTab('SIMULATOR')}
            onOpenPairing={handlePairingOpen}
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
            onOpenAddGoal={() => setIsAddGoalOpen(true)}
          />
        )}

        {activeTab === 'PARENT_STUDIO' && (
          <MobileParentStudio
            profile={activeProfile}
            currency={activeCurrency}
            onUpdatePlan={(updated) => updateActiveProfileData(updated)}
            onLockSession={handleLockParent}
            onOpenPairing={() => setIsParentPairingOpen(true)}
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

      {/* Multi-Currency Modal */}
      <CurrencyPickerModal
        isOpen={isCurrencyPickerOpen}
        currentCode={activeProfile.currencyCode}
        onSelectCurrency={handleSelectCurrency}
        onClose={() => setIsCurrencyPickerOpen(false)}
      />

      {/* Profile Sibling Switcher Modal */}
      <ProfilePickerModal
        isOpen={isProfilePickerOpen}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={switchProfile}
        onCreateProfile={createNewProfile}
        onClose={() => setIsProfilePickerOpen(false)}
      />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        currency={activeCurrency}
        onAddGoal={handleAddGoal}
        onClose={() => setIsAddGoalOpen(false)}
      />

      {/* Parent QR / Family Code Pairing Modal */}
      <ParentPairingModal
        isOpen={isParentPairingOpen}
        inviteCode={familyInviteCode}
        teenName={activeProfile.teenName}
        onClose={() => setIsParentPairingOpen(false)}
      />

      {/* Teen Code Entry Pairing Modal */}
      <TeenPairingModal
        isOpen={isTeenPairingOpen}
        onPairSuccess={() => {
          setIsTeenPairingOpen(false);
        }}
        onClose={() => setIsTeenPairingOpen(false)}
      />

      {/* Role Selection (Parent vs Teen) Modal */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        currentRole={userRole}
        onSelectRole={handleSelectRole}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}

export default App;
