import { DeviceInfo } from '@/types/DeviceInfo';
import * as Device from 'expo-device';
import { Dimensions, I18nManager } from 'react-native';
import {
    normalizeDeviceType,
    normalizeNumber,
    normalizeString,
} from './normalizeDevice';

/**
 * Build a fully normalized DeviceInfo object for the current device.
 */
export const buildDeviceInfo = (): DeviceInfo => {
    const { width, height } = Dimensions.get('screen');
    const minDimension = Math.min(width, height);

    return {
        brand: normalizeString(Device.brand),
        modelName: normalizeString(Device.modelName),
        deviceName: normalizeString(Device.deviceName),
        manufacturer: normalizeString(Device.manufacturer),
        osName: normalizeString(Device.osName),
        osVersion: Device.osVersion ?? null,
        deviceType: normalizeDeviceType(Device.deviceType),

        isTablet:
            Device.deviceType === Device.DeviceType.TABLET ||
            minDimension >= 600,

        isRTL: I18nManager.isRTL,
        screenWidth: width,
        screenHeight: height,
        totalMemory: normalizeNumber(Device.totalMemory),
        orientation: height >= width ? 'portrait' : 'landscape',
    };
};
