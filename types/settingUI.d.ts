import { Href } from 'expo-router';

export interface SettingsUIProps {
    setIsOpen: (v: boolean) => void;
    isOpen: boolean;
    safePush: (path: Href) => void;
    loading: boolean;
    logoutLoading: boolean;
    notifications: boolean;
    setNotifications: (v: boolean) => void;
    showVersion: boolean;
    setShowVersion: (v: boolean) => void;
    exportUserData: () => void;
    toggleSetting: (name: string, stateSetter: any, current: any) => void;
    useBiometrics: boolean;
    setUseBiometrics: (v: boolean) => void;
    handleShare: () => void;
    handleLogout: () => void;
}
