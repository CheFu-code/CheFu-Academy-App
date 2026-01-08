import * as Device from 'expo-device';

/**
 * Normalizes nullable string values coming from
 * native / SDK APIs into safe, non-empty strings.
 */
export const normalizeString = (
    value: string | null | undefined,
    fallback = 'unknown',
): string => value?.trim() || fallback;

/**
 * Normalizes nullable numbers into safe numeric values.
 */
export const normalizeNumber = (
    value: number | null | undefined,
    fallback = 0,
): number => value ?? fallback;

/**
 * Normalizes Expo device type into a safe enum value.
 */
export const normalizeDeviceType = (
    value: Device.DeviceType | null,
): Device.DeviceType => value ?? Device.DeviceType.UNKNOWN;
