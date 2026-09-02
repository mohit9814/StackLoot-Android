export type AppUserRole = 'PARENT' | 'TEEN' | 'UNSET';

export interface FamilyPairingInfo {
  familyId: string;
  inviteCode: string;
  parentName: string;
  teenName: string;
  isPaired: boolean;
  pairedAt?: string;
}
