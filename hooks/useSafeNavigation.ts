import { useRef, useCallback } from "react";
import { router, type Href } from "expo-router";

export function useSafeNavigation(delay = 500) {
    const isNavigatingRef = useRef(false);

    const lock = useCallback(() => {
        if (isNavigatingRef.current) return true;
        isNavigatingRef.current = true;
        setTimeout(() => {
            isNavigatingRef.current = false;
        }, delay);
        return false;
    }, [delay]);

    const safePush = useCallback((path: Href) => {
        if (lock()) return;
        router.push(path);
    }, [lock]);

    const safeReplace = useCallback((path: Href) => {
        if (lock()) return;
        router.replace(path);
    }, [lock]);

    const safeBack = useCallback(() => {
        if (lock()) return;
        router.back();
    }, [lock]);

    return { safePush, safeReplace, safeBack };
}