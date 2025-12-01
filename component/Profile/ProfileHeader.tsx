// components/Profile/ProfileHeader.tsx
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { formatDate } from '@/helpers/formatDate';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles, styles2 } from '@/styles/Profile.styles';
import { showToast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import LottieView from 'lottie-react-native';
import { useContext, useState } from 'react';
import {
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ErrorModal from '../Shared/ErrorModal';
import { auth } from '@/config/fireConfig';
import {  scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileHeaderProps {
    profilePicture: string;
    fullname: string;
    email: string;
    member: boolean;
    memberUntil?: string;
    planType?: string;
    createdAt?: string;
    provider?: string;
    onChangeAvatar: () => void;
    loading: boolean;
    onChangeName: (newName: string) => void;
    loader: boolean;
    loadingName: boolean;
}

export const ProfileHeader = ({
    profilePicture,
    fullname,
    email,
    member,
    memberUntil,
    planType,
    createdAt,
    provider,
    onChangeAvatar,
    onChangeName,
    loader,
    loadingName,
}: ProfileHeaderProps) => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { safePush } = useSafeNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [nameInput, setNameInput] = useState(fullname);
    const { loading, verifyEmail } = useProfileActions(
        userDetail,
        setUserDetail,
        safePush,
    );
    const [error, setError] = useState({
        message: '',
        visible: false,
        title: '',
    });

    const handleSave = () => {
        const trimmed = nameInput.trim();

        // Validation rules
        if (!trimmed) {
            setError({
                message: 'Name cannot be empty.',
                visible: true,
                title: 'Invalid Name',
            });
            return;
        }
        if (!/^[A-Za-z\s]+$/.test(trimmed)) {
            setError({
                message: 'Name can only contain letters and spaces.',
                visible: true,
                title: 'Invalid Name',
            });
            return;
        }
        if (trimmed.length > 30) {
            setError({
                message: 'Name cannot be longer than 30 characters.',
                visible: true,
                title: 'Invalid Name',
            });
            return;
        }

        onChangeName(trimmed);
        setModalVisible(false);
    };

    const downloadAvatar = async () => {
        if (!profilePicture) {
            setError({
                message: "You don't have a profile picture to download.",
                visible: true,
                title: 'No Avatar',
            });
            return;
        }

        try {
            // Request permissions (iOS requires it)
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                setError({
                    message: 'Cannot save image without permission.',
                    visible: true,
                    title: 'Permission Denied',
                });
                return;
            }

            // Download image to cache
            const fileUri = `${FileSystem.cacheDirectory}avatar.jpg`;
            const downloadedFile = await FileSystem.downloadAsync(
                profilePicture,
                fileUri,
            );

            // Save to media library
            const asset = await MediaLibrary.createAssetAsync(
                downloadedFile.uri,
            );
            await MediaLibrary.createAlbumAsync('CheFu Academy', asset, false);

            showToast('Downloaded successfully');
        } catch (error) {
            console.log('Download Avatar Error:', error);
            setError({
                message: 'Failed to download profile picture. Try again later.',
                visible: true,
                title: 'Download Error',
            });
        }
    };

    return (
        <>
            <SafeAreaView style={styles.header}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '90%',
                    }}
                >
                    {auth.currentUser?.emailVerified ? (
                        <Text
                            style={[
                                styles.profileEmail,
                                {
                                    color: Colors.GREEN,
                                    marginTop: verticalScale(10),
                                    opacity: 0.6,
                                },
                            ]}
                        >
                            Email Verified
                        </Text>
                    ) : (
                        <TouchableOpacity
                            disabled={loading}
                            onPress={verifyEmail}
                        >
                            <Text
                                style={[
                                    styles.profileEmail,
                                    {
                                        color: Colors.RED,
                                        textDecorationLine: 'underline',
                                        marginTop: verticalScale(10),
                                    },
                                ]}
                            >
                                Email not verified
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => safePush('/settings')}>
                        <Ionicons
                            style={{
                                marginTop: verticalScale(3),
                                alignItems: 'flex-end',
                                padding: scale(10),
                            }}
                            name="settings-outline"
                            size={scale(18)}
                            color={Colors.WHITE}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    disabled={loader}
                    onPress={onChangeAvatar}
                    onLongPress={downloadAvatar}
                >
                    {loader ? (
                        <LottieView
                            source={require('../../assets/animations/changingAvatar.json')}
                            autoPlay
                            loop
                            style={styles2.changingAvatar}
                        />
                    ) : (
                        <Image
                            style={[
                                styles.avatar,
                                {
                                    borderColor: member
                                        ? Colors.GREEN
                                        : Colors.PRIMARY,
                                },
                            ]}
                            source={
                                profilePicture
                                    ? { uri: profilePicture }
                                    : require('../../assets/images/logo.png')
                            }
                        />
                    )}
                </TouchableOpacity>

                {userDetail && (
                    <>
                        <View style={styles.common}>
                            <View>
                                <View style={styles.common}>
                                    <TouchableOpacity
                                        disabled={loadingName}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        {loadingName ? (
                                            <LottieView
                                                source={require('../../assets/animations/changingName.json')}
                                                autoPlay
                                                loop
                                                style={styles2.changingName}
                                            />
                                        ) : (
                                            <Text
                                                numberOfLines={1}
                                                style={styles.profileName}
                                            >
                                                {fullname}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                    {member && !loadingName && (
                                        <Ionicons
                                            color={Colors.PRIMARY}
                                            size={20}
                                            name="checkmark-circle"
                                        />
                                    )}
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={styles.profileEmail}
                                >
                                    Joined {formatDate(createdAt)}
                                </Text>
                            </View>
                        </View>

                        <Text numberOfLines={1} style={styles.profileEmail}>
                            {email}
                        </Text>

                        {planType && memberUntil && (
                            <Text style={styles.expiryText}>
                                Your plan will expire on{' '}
                                {memberUntil ? formatDate(memberUntil) : 'N/A'}
                            </Text>
                        )}
                    </>
                )}
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles2.modalBackground}>
                    <View style={styles2.modalContainer}>
                        <Text style={styles2.modalTitle}>Change Name</Text>
                        <TextInput
                            value={nameInput}
                            onChangeText={setNameInput}
                            style={styles.input}
                            placeholder="Enter new name"
                            placeholderTextColor={Colors.WHITE}
                        />
                        <View style={styles2.buttons}>
                            <TouchableOpacity
                                disabled={loader}
                                style={[
                                    styles2.buttonCancel,
                                    { opacity: loader ? 0.5 : 1 },
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles2.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={loader}
                                style={[
                                    styles2.buttonSave,
                                    { opacity: loader ? 0.5 : 1 },
                                ]}
                                onPress={handleSave}
                            >
                                <Text style={styles2.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    );
};
