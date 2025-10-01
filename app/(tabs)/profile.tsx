import ConfirmPasswordModal from '@/component/Profile/ConfirmPasswordModal';
import LoggedOutMessage from '@/component/Profile/LoggedOutMessage ';
import { ProfileHeader } from '@/component/Profile/ProfileHeader';
import { ProfileMenu } from '@/component/Profile/ProfileMenu';
import ErrorModal from '@/component/Shared/ErrorModal';
import { menuItems } from '@/data/menuItems';
import { usePickImage } from '@/hooks/usePickImage';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useRefreshProfile } from '@/hooks/useRefreshProfile';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { User } from '@/types/user';
import { changeAvatar } from '@/utils/changeAvatar';
import { showToast } from '@/utils/toast';
import { doc, updateDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Image, Linking, SafeAreaView, ToastAndroid } from 'react-native';
import AppModal from '../../component/Shared/AppModal';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/Profile.styles';
import { auth, db } from '@/config/fireConfig';

export default function Profile() {
    const { safePush, safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const {
        email,
        fullname,
        member,
        memberUntil,
        planType,
        provider,
        createdAt,
    } = userDetail || {};

    const [loader, setLoader] = useState(false);
    const [loadingName, setLoadingName] = useState(false);
    const { loading, handleLogout, handleDeleteAccount } = useProfileActions(
        userDetail,
        setUserDetail,
        router,
    );

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const isFreeUser = !member;
    const { refreshing, refreshData } = useRefreshProfile(email, setUserDetail);
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
    const renderedMenuItems = useMemo(
        () => menuItems(router, Linking, ToastAndroid, Colors),
        [],
    );

    useEffect(() => {
        if (!email) {
            safeReplace('/auth/signIn');
        } else {
            refreshData();
        }
    }, [email, safeReplace, refreshData]);

    useEffect(() => {
        setAvatarURL(userDetail?.profilePicture);
    }, [userDetail?.profilePicture]);

    const confirmDeleteAccount = useCallback(
        () => setShowPasswordModal(true),
        [],
    );

    const subscribe = useCallback(() => {
        if (member === true) {
            showToast('You are already a member.');
        } else {
            safePush('/subscription');
        }
    }, [member, safePush]);

    const handleChangeAvatar = async () => {
        setLoader(true);
        try {
            const newURL = await changeAvatar(setUserDetail);
            if (newURL) setAvatarURL(newURL);
            await refreshData();
        } finally {
            setLoader(false);
        }
    };

    const updateUserName = async (newName: string) => {
        setLoadingName(true);
        try {
            const user = auth.currentUser;
            if (user) {
                // Update Firebase Auth display name
                await user.updateProfile({ displayName: newName });

                // Optionally, update Firestore user document
                if (user?.email) {
                    await updateDoc(doc(db, 'users', user.email), {
                        fullname: newName,
                    });
                    setUserDetail((prev: User) => ({
                        ...prev,
                        fullname: newName,
                    }));
                } else {
                    console.warn(
                        'User email is null, cannot update Firestore document.',
                    );
                }

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
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/images/graph.png')}
                style={{ position: 'absolute', width: '100%', height: 500 }}
            />
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
                            member={member}
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
                            refreshing={refreshing}
                            avatarURL={avatarURL}
                            menuItems={renderedMenuItems}
                            subscribe={subscribe}
                            isFreeUser={isFreeUser}
                            loading={loading}
                            handleLogout={handleLogout}
                            confirmDeleteAccount={confirmDeleteAccount}
                        />
                    )}

                    {userDetail && (
                        <ConfirmPasswordModal
                            visible={showPasswordModal}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            loading={loading}
                            onCancel={() => {
                                setShowPasswordModal(false);
                                setPassword('');
                            }}
                            onConfirm={() => handleDeleteAccount(password)}
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
