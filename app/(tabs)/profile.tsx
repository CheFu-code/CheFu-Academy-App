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
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal from '../../component/Shared/AppModal';
import { UserDetailContext } from '../../context/UserDetailContext';

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
        if (userDetail?.profilePicture) {
            setAvatarURL(userDetail.profilePicture);
        }
    }, [userDetail?.profilePicture]);

    const handleChangeAvatar = async () => {
        await changeAvatar({
            email,
            avatarURL,
            setLoader,
            setAvatarURL,
            setUserDetail,
            setErrorModal,
        });
    };

    const updateUserName = async (newName: string) => {
        if (!email || !newName) return;
        setLoadingName(true);
        try {
            // Replaced Firebase hit with our API client call
            await chefuApiClient.put(`/academy-mobile/users/${email}/profile`, {
                fullname: newName
            });

            setUserDetail((prev: User | null) => {
                if (!prev) return null;
                return { ...prev, fullname: newName };
            });
            showToast('Name updated successfully');
        } catch (error: any) {
            console.error('Error updating name:', error);
            setErrorModal({
                visible: true,
                title: 'Update Failed',
                message: error.message || 'Could not update name. Try again.',
            });
        } finally {
            setLoadingName(false);
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor }}>
            {!userDetail ? (
                <LoggedOutMessage />
            ) : (
                <>
                    {email && fullname && (
                        <ProfileHeader
                            loader={loader}
                            loadingName={loadingName}
                            profilePicture={avatarURL || ''}
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