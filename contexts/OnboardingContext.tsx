import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

const ONBOARDING_KEY = 'has_completed_onboarding';

export const [OnboardingProvider, useOnboarding] = createContextHook(() => {
  const router = useRouter();
  const segments = useSegments();

  const onboardingQuery = useQuery({
    queryKey: ['onboarding'],
    queryFn: async () => {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return true;
    },
    onSuccess: () => {
      onboardingQuery.refetch();
    },
  });

  const hasCompletedOnboarding = onboardingQuery.data ?? false;
  const isLoading = onboardingQuery.isLoading;

  useEffect(() => {
    if (isLoading) return;

    const inTabs = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [hasCompletedOnboarding, isLoading, segments]);

  return {
    hasCompletedOnboarding,
    isLoading,
    completeOnboarding: completeMutation.mutate,
  };
});
