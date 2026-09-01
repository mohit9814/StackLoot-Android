import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserProfile, CreateProfileParams } from '../types/profile';
import { nativeStorage, createDefaultProfile } from '../services/nativeStorage';
import { hapticsService } from '../services/hapticsService';

export function useMobileProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([createDefaultProfile()]);
  const [activeProfileId, setActiveProfileId] = useState<string>('profile-akshat-default');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from native device storage on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const storedProfiles = await nativeStorage.getProfiles();
      const storedActiveId = await nativeStorage.getActiveProfileId();
      if (isMounted) {
        setProfiles(storedProfiles);
        const validId = storedProfiles.some((p) => p.id === storedActiveId)
          ? storedActiveId
          : storedProfiles[0]?.id || 'profile-akshat-default';
        setActiveProfileId(validId);
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || createDefaultProfile();
  }, [profiles, activeProfileId]);

  const switchProfile = useCallback(async (id: string) => {
    await hapticsService.impactLight();
    setActiveProfileId(id);
    await nativeStorage.setActiveProfileId(id);
  }, []);

  const updateActiveProfileData = useCallback(async (updates: Partial<UserProfile>) => {
    setProfiles((prev) => {
      const updated = prev.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      nativeStorage.saveProfiles(updated);
      return updated;
    });
  }, [activeProfileId]);

  const createNewProfile = useCallback(async (params: CreateProfileParams) => {
    await hapticsService.notifySuccess();
    const created = await nativeStorage.createProfile(params);
    const refreshed = await nativeStorage.getProfiles();
    setProfiles(refreshed);
    setActiveProfileId(created.id);
    return created;
  }, []);

  return {
    profiles,
    activeProfile,
    activeProfileId,
    isLoading,
    switchProfile,
    updateActiveProfileData,
    createNewProfile,
  };
}
