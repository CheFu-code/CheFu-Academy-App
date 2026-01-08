// types/DeviceInfo.ts
import * as Device from 'expo-device';

export type DeviceInfo = {
    brand: string; // was deviceBrand
    modelName: string; // was deviceModel
    deviceName: string;
    isRTL: boolean;
    isTablet: boolean;
    manufacturer: string;
    orientation: string;
    osName: string; // was os
    osVersion: string | null; // change number to string | null if needed
    screenHeight: number;
    screenWidth: number;
    totalMemory: number;
    deviceType: Device.DeviceType;
};
