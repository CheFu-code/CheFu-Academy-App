import { Href } from 'expo-router';
import { UserDetail } from './UserDetail';

export interface SettingsUIProps {
    safeBack: () => void;
    setIsOpen: (v: boolean) => void;
    isOpen: boolean;
    safePush: (path: Href) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    notifications: boolean;
    setNotifications: (v: boolean) => void;
    showVersion: boolean;
    setShowVersion: (v: boolean) => void;
    exportUserData: () => void;
    toggleSetting: (name: string, stateSetter: any, current: any) => void;
    useBiometrics: boolean;
    setUseBiometrics: (v: boolean) => void;
    handleShare: () => void;
    userDetail: UserDetail;
    verify: () => void;
    handleLogout: () => void;
}
