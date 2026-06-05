import Error from '@/component/Setting/Error';
import FatalError from '@/component/Setting/FatalError';
import SettingsUI from '@/component/Setting/SettingsUI';
import { useShareApp } from '@/handlers/handleShareApp';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useExportUserData } from '@/services/exportUserData';
import { useFetchSetting } from '@/utils/fetchSettings';
import { useToggle } from '@/utils/toggleSetting';
import { useEffect, useState } from 'react';
import AppModal from '../component/Shared/AppModal';
import { useSafeNavigation } from '../hooks/useSafeNavigation';

export default function SettingsScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const [showVersion, setShowVersion] = useState(false);
    const { handleShare } = useShareApp();
    const {
        notifications,
        setNotifications,
        fetchSettings,
        useBiometrics,
        setUseBiometrics,
    } = useFetchSetting();
    const { toggleSetting } = useToggle();
    const {
        loading,
        fatalError,
        setFatalError,
        errorModal,
        setErrorModal,
        exportUserData,
    } = useExportUserData();
    const { safePush } = useSafeNavigation();
    const { loading: logoutLoading, handleLogout } = useProfileActions();

    const [successModal, setSuccessModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    useEffect(() => {
        try {
            fetchSettings();
        } catch (err: any) {
            setFatalError(err);
        }
    }, [fetchSettings, setFatalError]);

    let content;
    try {
        if (fatalError) {
            content = <FatalError />;
        } else {
            content = (
                <>
                    <SettingsUI
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        safePush={safePush}
                        loading={loading}
                        logoutLoading={logoutLoading}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        showVersion={showVersion}
                        setShowVersion={setShowVersion}
                        exportUserData={exportUserData}
                        toggleSetting={toggleSetting}
                        useBiometrics={useBiometrics}
                        setUseBiometrics={setUseBiometrics}
                        handleShare={handleShare}
                        handleLogout={handleLogout}
                    />

                    <AppModal
                        visible={errorModal.visible}
                        title={errorModal.title}
                        message={errorModal.message}
                        onCancel={null}
                        onConfirm={() =>
                            setErrorModal({ ...errorModal, visible: false })
                        }
                        cancelText="Cancel"
                        confirmText="OK"
                        showCancel={false}
                        confirmColor="green"
                        cancelColor="red"
                    />

                    <AppModal
                        visible={successModal.visible}
                        title={successModal.title}
                        message={successModal.message}
                        confirmText="OK"
                        showCancel={false}
                        onConfirm={() =>
                            setSuccessModal({ ...successModal, visible: false })
                        }
                        onCancel={null}
                    />
                </>
            );
        }
    } catch (err) {
        content = <Error err={err} />;
    }
    return content;
}
