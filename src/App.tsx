import { useState, useMemo, useEffect, useCallback } from 'react';
import { MobileHeader } from './components/common/MobileHeader';
import { BottomNavBar } from './components/common/BottomNavBar';
import { MobileVaultView } from './components/teen/MobileVaultView';
import { MobileGrowthLab } from './components/simulator/MobileGrowthLab';
import { MobileTasksView } from './components/tasks/MobileTasksView';
import { MobileGoalsView } from './components/teen/MobileGoalsView';
import { MobileParentStudio } from './components/parent/MobileParentStudio';
import { PinGateModal } from './components/modals/PinGateModal';
import { CurrencyPickerModal } from './components/modals/CurrencyPickerModal';
import { ProfilePickerModal } from './components/modals/ProfilePickerModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { ParentPairingModal } from './components/onboarding/ParentPairingModal';
import { TeenPairingModal } from './components/onboarding/TeenPairingModal';
import { RoleSelectionModal } from './components/onboarding/RoleSelectionModal';
import { IntroSplashScreen } from './components/onboarding/IntroSplashScreen';
import { ParentSetupWizard } from './components/onboarding/ParentSetupWizard';
import { useMobileProfiles } from './hooks/useMobileProfiles';
import { calculateCompoundSchedule } from './services/compoundEngine';
import { CURRENCIES } from './config/currencies';
import { nativeStorage } from './services/nativeStorage';
import { taskService } from './services/taskService';
import { activityService } from './services/activityService';
import { confettiService } from './services/confettiService';
import type { MobileTab } from './types/userRole';
import type { SimulationParams, CurrencyCode } from './types/allowance';
import type { UserProfile } from './types/profile';
import type { SavingsGoal } from './types/goal';
import type { AppUserRole } from './types/pairing';
import type { ChoreTask } from './types/task';
import type { ActivityItem } from './types/activity';
import type { ParentOnboardingSetup } from './types/onboarding';

export function App() {
  const {
    profiles,
    activeProfile,
    activeProfileId,
    switchProfile,
    updateActiveProfileData,
    createNewProfile,
    setAllProfiles,
    isLoading,
  } = useMobileProfiles();

  const [isOnboardingDone, setIsOnboardingDone] = useState<boolean | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<AppUserRole>('TEEN');
  const [activeTab, setActiveTab] = useState<MobileTab>('VAULT');
  const [isPinGateOpen, setIsPinGateOpen] = useState<boolean>(false);
  const [pinSuccessAction, setPinSuccessAction] = useState<(() => void) | null>(null);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState<boolean>(false);
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState<boolean>(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isParentPairingOpen, setIsParentPairingOpen] = useState<boolean>(false);
  const [isTeenPairingOpen, setIsTeenPairingOpen] = useState<boolean>(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ChoreTask[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [simParams, setSimParams] = useState<SimulationParams>(() => activeProfile.simulationParams);

  // Sync simulation parameters whenever active profile changes
  useEffect(() => {
    if (activeProfile?.simulationParams) {
      setSimParams(activeProfile.simulationParams);
    }
  }, [activeProfile?.id, activeProfile?.simulationParams]);

  // Load tasks & activities for active profile
  const refreshTasksAndActivities = useCallback(async (profileId: string) => {
    const profileTasks = await taskService.getTasksForProfile(profileId);
    const profileActs = await activityService.getActivities(profileId);
    setTasks(profileTasks);
    setActivities(profileActs);
  }, []);

  useEffect(() => {
    if (activeProfile?.id) {
      refreshTasksAndActivities(activeProfile.id);
    }
  }, [activeProfile?.id, refreshTasksAndActivities]);

  // Load saved user role & onboarding status on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pairCode = params.get('pair');
    const roleParam = params.get('role');

    nativeStorage.getOnboardingDone().then((done) => {
      if (pairCode || done) {
        setIsOnboardingDone(true);
      } else {
        setIsOnboardingDone(false);
      }
    });

    if (pairCode) {
      setUserRole('TEEN');
      nativeStorage.setUserRole('TEEN');
      confettiService.fireUnlock();
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (roleParam === 'PARENT' || roleParam === 'TEEN') {
      setUserRole(roleParam);
      nativeStorage.setUserRole(roleParam);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

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

  const requireParentPin = (action: () => void) => {
    if (userRole === 'PARENT' && isParentUnlocked) {
      action();
    } else {
      setPinSuccessAction(() => action);
      setIsPinGateOpen(true);
    }
  };

  const handleParentSetupComplete = async (
    setup: ParentOnboardingSetup,
    starterChores: Omit<ChoreTask, 'id' | 'assignedToProfileId' | 'status'>[]
  ) => {
    const newProfiles: UserProfile[] = setup.children.map((child, idx) => ({
      id: `profile-${Date.now()}-${idx}`,
      teenName: child.name,
      parentName: setup.parentName,
      avatarEmoji: child.avatarEmoji,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currencyCode: setup.currencyCode,
      simulationParams: {
        monthlyAllowance: setup.monthlyAllowance,
        deferralPercentage: setup.deferralPercentage,
        annualInterestRate: setup.annualInterestRate,
        termMonths: setup.termMonths,
        completionBonusPercentage: setup.completionBonusPercentage,
        parentInterestMatchMultiplier: setup.parentMatchMultiplier,
      },
      activePlan: {
        planId: `plan-${Date.now()}-${idx}`,
        teenName: child.name,
        parentName: setup.parentName,
        startDate: new Date().toISOString(),
        targetTermMonths: setup.termMonths,
        monthlyAllowance: setup.monthlyAllowance,
        deferralPercentage: setup.deferralPercentage,
        annualInterestRate: setup.annualInterestRate,
        completionBonusPercentage: setup.completionBonusPercentage,
        parentInterestMatchMultiplier: setup.parentMatchMultiplier,
        initialLumpSumDeposit: 0,
        currentBalance: 0,
        totalPrincipalContributed: 0,
        totalInterestEarned: 0,
        totalBonusesEarned: 0,
        status: 'ACTIVE',
        transactions: [],
      },
      goals: [
        {
          id: `goal-init-${Date.now()}`,
          title: 'Special Dream Reward',
          targetAmount: setup.monthlyAllowance * 6,
          category: 'TECH',
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    // Seed selected chores
    const initialTasks: ChoreTask[] = [];
    newProfiles.forEach((profile) => {
      starterChores.forEach((chore, cIdx) => {
        initialTasks.push({
          ...chore,
          id: `task-${profile.id}-${cIdx}-${Date.now()}`,
          assignedToProfileId: profile.id,
          status: 'TODO',
        });
      });
    });
    await taskService.saveTasks(initialTasks);

    await setAllProfiles(newProfiles);
    await nativeStorage.setOnboardingDone(true);
    await nativeStorage.setUserRole('PARENT');

    await activityService.addActivity({
      profileId: newProfiles[0].id,
      title: 'Family Vault Created',
      description: `${setup.parentName} configured Bank of ${setup.parentName} with ${setup.annualInterestRate}% yield.`,
      type: 'PLAN_ACTIVATED',
    });

    setUserRole('PARENT');
    setIsParentUnlocked(true);
    setIsWizardOpen(false);
    setIsOnboardingDone(true);
    setActiveTab('VAULT');
  };

  const handleSelectRole = async (role: AppUserRole) => {
    if (role === 'PARENT') {
      requireParentPin(() => {
        setUserRole('PARENT');
        nativeStorage.setUserRole('PARENT');
        setIsParentUnlocked(true);
        setActiveTab('PARENT_STUDIO');
      });
    } else {
      setUserRole('TEEN');
      await nativeStorage.setUserRole('TEEN');
      setActiveTab('VAULT');
    }
  };

  const handleTabChange = (tab: MobileTab) => {
    if (tab === 'PARENT_STUDIO' && !isParentUnlocked) {
      requireParentPin(() => {
        setIsParentUnlocked(true);
        setUserRole('PARENT');
        setActiveTab('PARENT_STUDIO');
      });
      return;
    }
    setActiveTab(tab);
  };

  const handlePinSuccess = () => {
    setIsParentUnlocked(true);
    setIsPinGateOpen(false);
    if (pinSuccessAction) {
      pinSuccessAction();
      setPinSuccessAction(null);
    } else {
      setUserRole('PARENT');
      setActiveTab('PARENT_STUDIO');
    }
  };

  const handleLockParent = () => {
    setIsParentUnlocked(false);
    setUserRole('TEEN');
    nativeStorage.setUserRole('TEEN');
    setActiveTab('VAULT');
  };

  const handleSelectCurrency = (code: CurrencyCode) => {
    updateActiveProfileData({ currencyCode: code });
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    const updatedGoals = [...activeProfile.goals, newGoal];
    updateActiveProfileData({ goals: updatedGoals });
    activityService.addActivity({
      profileId: activeProfile.id,
      title: 'New Wishlist Goal',
      description: `${activeProfile.teenName} added "${newGoal.title}" (${activeCurrency.symbol}${newGoal.targetAmount})`,
      type: 'GOAL_CREATED',
      amount: newGoal.targetAmount,
    });
  };

  const handleMarkTaskCompleted = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const updated = await taskService.markTaskCompleted(taskId);
    setTasks(updated.filter((t) => t.assignedToProfileId === activeProfile.id));

    if (task) {
      const acts = await activityService.addActivity({
        profileId: activeProfile.id,
        title: 'Task Review Requested',
        description: `${activeProfile.teenName} completed "${task.title}"`,
        type: 'TASK_SUBMITTED',
        amount: task.rewardAmount,
      });
      setActivities(acts);
    }
  };

  const handleApproveTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updated = await taskService.approveTask(taskId);
    setTasks(updated.filter((t) => t.assignedToProfileId === activeProfile.id));

    // Credit bounty to active profile vault
    const currentBal = activeProfile.activePlan?.currentBalance || 0;
    const nowIso = new Date().toISOString();
    const updatedProfile: UserProfile = {
      ...activeProfile,
      activePlan: activeProfile.activePlan
        ? {
            ...activeProfile.activePlan,
            currentBalance: currentBal + task.rewardAmount,
            transactions: [
              ...(activeProfile.activePlan.transactions || []),
              {
                id: `tx-${Date.now()}-chore`,
                date: nowIso,
                monthIndex: 0,
                type: 'BONUS_MATCH',
                amount: task.rewardAmount,
                balanceAfter: currentBal + task.rewardAmount,
                notes: `Bounty: ${task.title}`,
              },
            ],
          }
        : null,
      updatedAt: nowIso,
    };

    updateActiveProfileData(updatedProfile);

    const acts = await activityService.addActivity({
      profileId: activeProfile.id,
      title: 'Bounty Approved & Credited',
      description: `${activeProfile.parentName} approved "${task.title}" (+${activeCurrency.symbol}${task.rewardAmount})`,
      type: 'TASK_APPROVED',
      amount: task.rewardAmount,
    });
    setActivities(acts);
  };

  const handleAddNewTask = async (newTaskData: Omit<ChoreTask, 'id' | 'status'>) => {
    requireParentPin(async () => {
      const created: ChoreTask = {
        ...newTaskData,
        id: `task-${Date.now()}`,
        assignedToProfileId: activeProfile.id,
        status: 'TODO',
      };
      const all = [...tasks, created];
      await taskService.saveTasks(all);
      setTasks(all);
    });
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<ChoreTask>) => {
    requireParentPin(async () => {
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      await taskService.saveTasks(updated);
      setTasks(updated);
    });
  };

  const handleLogStudioActivity = async (title: string, desc: string, amount: number) => {
    const acts = await activityService.addActivity({
      profileId: activeProfile.id,
      title,
      description: desc,
      type: 'MONTH_PROGRESSED',
      amount,
    });
    setActivities(acts);
  };

  const executeActivatePlan = () => {
    confettiService.fireCelebration();

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
        currentBalance: activeProfile.activePlan?.currentBalance || 0,
        totalPrincipalContributed: activeProfile.activePlan?.totalPrincipalContributed || 0,
        totalInterestEarned: activeProfile.activePlan?.totalInterestEarned || 0,
        totalBonusesEarned: activeProfile.activePlan?.totalBonusesEarned || 0,
        status: 'ACTIVE',
        transactions: activeProfile.activePlan?.transactions || [],
      },
    };

    updateActiveProfileData(updated);
    setActiveTab('VAULT');
  };

  const handleActivatePlan = () => {
    if (userRole === 'PARENT') {
      executeActivatePlan();
    } else {
      requireParentPin(executeActivatePlan);
    }
  };

  if (isLoading || isOnboardingDone === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-mono">
        Loading StackLoot Vault...
      </div>
    );
  }

  // First-Time Animated Splash Flow
  if (!isOnboardingDone && !isWizardOpen) {
    return (
      <IntroSplashScreen
        onStartParentSetup={() => setIsWizardOpen(true)}
        onJoinAsTeen={() => setIsTeenPairingOpen(true)}
      />
    );
  }

  // Parent Persona & Kids Setup Wizard
  if (!isOnboardingDone && isWizardOpen) {
    return (
      <ParentSetupWizard
        onComplete={handleParentSetupComplete}
        onCancel={() => setIsWizardOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Mobile Top Header */}
      <MobileHeader
        profile={activeProfile}
        currency={activeCurrency}
        userRole={userRole}
        onOpenProfilePicker={() => requireParentPin(() => setIsProfilePickerOpen(true))}
        onOpenCurrencyPicker={() => requireParentPin(() => setIsCurrencyPickerOpen(true))}
        onOpenRolePicker={() => setIsRoleModalOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 py-3">
        {activeTab === 'VAULT' && (
          <MobileVaultView
            profile={activeProfile}
            simulation={simulationResult}
            currency={activeCurrency}
            onOpenGrowthLab={() => setActiveTab('SIMULATOR')}
            onOpenPairing={() => (userRole === 'PARENT' ? setIsParentPairingOpen(true) : setIsTeenPairingOpen(true))}
          />
        )}

        {activeTab === 'SIMULATOR' && (
          <MobileGrowthLab
            params={simParams}
            onChangeParams={setSimParams}
            simulation={simulationResult}
            currency={activeCurrency}
            userRole={userRole}
            onActivatePlan={handleActivatePlan}
          />
        )}

        {activeTab === 'TASKS' && (
          <MobileTasksView
            tasks={tasks}
            activities={activities}
            currency={activeCurrency}
            userRole={userRole}
            teenName={activeProfile.teenName}
            parentName={activeProfile.parentName}
            onMarkTaskCompleted={handleMarkTaskCompleted}
            onApproveTask={handleApproveTask}
            onAddNewTask={handleAddNewTask}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {activeTab === 'GOALS' && (
          <MobileGoalsView
            goals={activeProfile.goals}
            vaultBalance={activeProfile.activePlan?.currentBalance || 0}
            currency={activeCurrency}
            simulationParams={simParams}
            onOpenAddGoal={() => setIsAddGoalOpen(true)}
            onOpenTasks={() => setActiveTab('TASKS')}
          />
        )}

        {activeTab === 'PARENT_STUDIO' && (
          <MobileParentStudio
            profile={activeProfile}
            currency={activeCurrency}
            onUpdatePlan={(updated) => updateActiveProfileData(updated)}
            onLockSession={handleLockParent}
            onOpenPairing={() => setIsParentPairingOpen(true)}
            onLogActivity={handleLogStudioActivity}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

      {/* PIN Security Gate Modal for Parent Protection */}
      <PinGateModal
        isOpen={isPinGateOpen}
        onSuccess={handlePinSuccess}
        onClose={() => {
          setIsPinGateOpen(false);
          setPinSuccessAction(null);
        }}
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

      {/* Add Goal Modal (Accessible by Kid) */}
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
          setIsOnboardingDone(true);
        }}
        onClose={() => setIsTeenPairingOpen(false)}
      />

      {/* Role Selection (Parent vs Teen) Modal */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        currentRole={userRole}
        onSelectRole={handleSelectRole}
        onResetOnboarding={async () => {
          await nativeStorage.setOnboardingDone(false);
          setIsOnboardingDone(false);
          setIsWizardOpen(false);
        }}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}

export default App;
