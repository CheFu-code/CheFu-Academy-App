import Error from '@/component/Setting/Error';
import FatalError from '@/component/Setting/FatalError';
import SettingsUI from '@/component/Setting/SettingsUI';
import { useShareApp } from '@/handlers/handleShareApp';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useExportUserData } from '@/services/exportUserData';
import { useVerifyEmail } from '@/services/verifyUserEmail';
import { useFetchSetting } from '@/utils/fetchSettings';
import { useToggle } from '@/utils/toggleSetting';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import AppModal from '../component/Shared/AppModal';
import { UserDetailContext } from '../context/UserDetailContext';
import { useSafeNavigation } from '../hooks/useSafeNavigation';

export default function SettingsScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading] = useState(false);
    const [fatalError, setFatalError] = useState(null);
    const [showVersion, setShowVersion] = useState(false);
    const [useBiometrics, setUseBiometrics] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const { verify } = useVerifyEmail();
    const { handleShare } = useShareApp();
    const { fetchSettings } = useFetchSetting();
    const { toggleSetting } = useToggle();
    const { exportUserData } = useExportUserData();
    const { safePush, safeBack } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { handleLogout } = useProfileActions(
        userDetail,
        setUserDetail,
        router,
    );
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
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
    }, [fetchSettings]);

    <AppModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onCancel={null}
        onConfirm={() => setErrorModal({ ...errorModal, visible: false })}
        cancelText="Cancel"
        confirmText="OK"
        showCancel={false}
        confirmColor="green"
        cancelColor="red"
    />;

    <AppModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setSuccessModal({ ...successModal, visible: false })}
        onCancel={null}
    />;

    let content;
    try {
        if (fatalError) {
            content = <FatalError />;
        } else {
            content = (
                <SettingsUI
                    safeBack={safeBack}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    safePush={safePush}
                    loading={loading}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    showVersion={showVersion}
                    setShowVersion={setShowVersion}
                    exportUserData={exportUserData}
                    toggleSetting={toggleSetting}
                    useBiometrics={useBiometrics}
                    setUseBiometrics={setUseBiometrics}
                    handleShare={handleShare}
                    userDetail={userDetail}
                    verify={verify}
                    handleLogout={handleLogout}
                />
            );
        }
    } catch (err) {
        content = <Error err={err} />;
    }
    return content;
}
