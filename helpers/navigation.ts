import { useSafeNavigation } from '@/hooks/useSafeNavigation';

export const Google = () => {
    const { safeReplace } = useSafeNavigation();
    safeReplace('/auth/google');
};
