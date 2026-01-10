// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Returns a debounced value that updates only after the delay.
 * @param value The value to debounce
 * @param delay Delay in ms
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};
