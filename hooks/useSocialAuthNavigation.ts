// hooks/useSocialAuthNavigation.ts
import { useRouter } from "expo-router";

export const useSocialAuthNavigation = () => {
  const router = useRouter();
  return {
    navigateGitHub: () => router.push("/auth/github"),
    navigateGoogle: () => router.push("/auth/google"),
  };
};
