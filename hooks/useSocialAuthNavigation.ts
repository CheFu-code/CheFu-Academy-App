// hooks/useSocialAuthNavigation.ts
import { useSafeNavigation } from "./useSafeNavigation";

export const useSocialAuthNavigation = () => {
  const { safePush } = useSafeNavigation()
  return {
    navigateGitHub: () => safePush("/auth/github"),
    navigateGoogle: () => safePush("/auth/google"),
  };
};
