import LoggedOutMessage from '@/component/Profile/LoggedOutMessage';
import { ProfileHeader } from '@/component/Profile/ProfileHeader';
import { ProfileMenu } from '@/component/Profile/ProfileMenu';
import ErrorModal from '@/component/Shared/ErrorModal';
import useDarkMode from '@/hooks/useDarkMode';
import { usePickImage } from '@/hooks/usePickImage';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useRefreshProfile } from '@/hooks/useRefreshProfile';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { chefuApiClient } from '@/services/chefuApiClient';
import { User } from '@/types/user';
import { changeAvatar } from '@/utils/changeAvatar';
import { showToast } from '@/utils/toast';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import AppModal from '../../component/Shared/AppModal';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/Profile.styles';

export default function Profile() {
    const { safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const {
        email,
        fullname,
        memberUntil,
        planType,
        provider,
        createdAt,
    } = userDetail || {};

    const [loader, setLoader] = useState(false);
    const [loadingName, setLoadingName] = useState(false);
    const { loading, handleLogout } = useProfileActions();

    const { backgroundColor } = useDarkMode();
    const { refreshData } = useRefreshProfile(email, setUserDetail);
    const { error, setError } = usePickImage();
    const [avatarURL, setAvatarURL] = useState(userDetail?.profilePicture);
    const [modalVisible, setModalVisible] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    useEffect(() => {
        if (!email) {
            safeReplace('/auth/sso' as any);
        } else {
            refreshData();
        }
    }, [email, safeReplace, refreshData]);

    useEffect(() => {
        setAvatarURL(userDetail?.profilePicture);
    }, [userDetail?.profilePicture]);

    const handleChangeAvatar = async () => {
        setLoader(true);
        try {
            const newURL = await changeAvatar(setUserDetail, userDetail);
            if (newURL) setAvatarURL(newURL);
            await refreshData();
        } finally {
            setLoader(false);
        }
    };

    const updateUserName = async (newName: string) => {
        setLoadingName(true);
        try {
            if (userDetail?.email) {
                await chefuApiClient.patch('/api/academy/mobile/me', {
                    fullname: newName,
                });
                setUserDetail((prev: User) => ({ ...prev, fullname: newName }));
                showToast('Name updated successfully');
            }
        } catch (error) {
            console.error('Error updating name:', error);
            showToast('Error updating name');
        } finally {
            setLoadingName(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {!userDetail ? (
                <LoggedOutMessage />
            ) : (
                <>
                    {userDetail && (
                        <ProfileHeader
                            loadingName={loadingName}
                            loader={loader}
                            loading={loading}
                            profilePicture={avatarURL}
                            fullname={fullname}
                            email={email}
                            member={Boolean(userDetail?.member)}
                            memberUntil={memberUntil}
                            planType={planType}
                            createdAt={createdAt}
                            provider={provider}
                            onChangeAvatar={handleChangeAvatar}
                            onChangeName={(newName) => updateUserName(newName)}
                        />
                    )}

                    {userDetail && (
                        <ProfileMenu
                            loading={loading}
                            handleLogout={handleLogout}
                        />
                    )}

                    <AppModal
                        onCancel={null}
                        visible={modalVisible.visible}
                        title={modalVisible.title}
                        message={modalVisible.message}
                        confirmText="OK"
                        showCancel={false}
                        onConfirm={() =>
                            setModalVisible((prev) => ({
                                ...prev,
                                visible: false,
                            }))
                        }
                    />

                    <ErrorModal
                        visible={errorModal.visible}
                        title={errorModal.title}
                        message={errorModal.message}
                        onConfirm={() =>
                            setErrorModal((prev) => ({
                                ...prev,
                                visible: false,
                            }))
                        }
                    />
                    <ErrorModal
                        visible={error.visible}
                        title={error.title}
                        message={error.message}
                        onConfirm={() =>
                            setError((prev) => ({
                                ...prev,
                                visible: false,
                            }))
                        }
                    />
                </>
            )}
        </SafeAreaView>
    );
}
