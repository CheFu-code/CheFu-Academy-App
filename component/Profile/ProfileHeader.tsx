import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { formatDate } from '@/helpers/formatDate';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { chefuAccountManageUrl } from '@/services/ssoAuth';
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
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorModal from '../Shared/ErrorModal';

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
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const [nameInput, setNameInput] = useState(fullname);
    const [modalVisible, setModalVisible] = useState(false);
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
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                setError({
                    message: 'Cannot save image without permission.',
                    visible: true,
                    title: 'Permission Denied',
                });
                return;
            }

            const fileUri = `${FileSystem.cacheDirectory}avatar.jpg`;
            const downloadedFile = await FileSystem.downloadAsync(
                profilePicture,
                fileUri,
            );

            const asset = await MediaLibrary.createAssetAsync(
                downloadedFile.uri,
            );
            await MediaLibrary.createAlbumAsync('CheFu Academy', asset, false);

            showToast('Downloaded successfully');
        } catch (error) {
            console.error('Download Avatar Error:', error);
            setError({
                message: 'Failed to download profile picture. Try again later.',
                visible: true,
                title: 'Download Error',
            });
        }
    };

    return (
        <>
            <SafeAreaView className="items-center pb-6">
                <View className="flex-row justify-between w-[90%]">
                    <TouchableOpacity onPress={() => Linking.openURL(chefuAccountManageUrl())}>
                        <Text className="text-green-500 mt-3 underline font-outfit text-sm">
                            CheFu Account
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => safePush('/settings')} className="mt-1 p-2">
                        <Ionicons name="settings-outline" size={20} color={color} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    disabled={loader}
                    onPress={onChangeAvatar}
                    onLongPress={downloadAvatar}
                    className="mt-6 mb-4"
                >
                    {loader ? (
                        <LottieView
                            source={require('../../assets/animations/changingAvatar.json')}
                            autoPlay
                            loop
                            className="w-40 h-40"
                        />
                    ) : (
                        <Image
                            className={`w-36 h-36 rounded-full border-4 ${member ? 'border-green-500' : 'border-primary'}`}
                            source={
                                profilePicture
                                    ? { uri: profilePicture }
                                    : require('../../assets/images/logo.png')
                            }
                        />
                    )}
                </TouchableOpacity>

                {userDetail && (
                    <View className="items-center space-y-1">
                        <View className="flex-row items-center space-x-1">
                            <TouchableOpacity
                                disabled={loadingName}
                                onPress={() => setModalVisible(true)}
                            >
                                {loadingName ? (
                                    <LottieView
                                        source={require('../../assets/animations/changingName.json')}
                                        autoPlay
                                        loop
                                        className="w-24 h-16"
                                    />
                                ) : (
                                    <Text className="text-2xl font-outfitBold text-primary max-w-[250px] text-center" numberOfLines={1}>
                                        {fullname}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            {member && !loadingName && (
                                <Ionicons color={Colors.PRIMARY} size={20} name="checkmark-circle" />
                            )}
                        </View>
                        
                        <Text className="text-sm font-outfit" style={{ color }} numberOfLines={1}>
                            Joined {formatDate(createdAt)}
                        </Text>
                        
                        <Text className="text-sm font-outfit mt-1" style={{ color }} numberOfLines={1}>
                            {email}
                        </Text>

                        {planType && memberUntil && (
                            <Text className="text-sm font-outfit text-gray-400 mt-2 text-center px-4">
                                Your plan will expire on {memberUntil ? formatDate(memberUntil) : 'N/A'}
                            </Text>
                        )}
                    </View>
                )}
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center">
                    <View className="w-4/5 rounded-2xl p-6" style={{ backgroundColor }}>
                        <Text className="text-lg font-bold mb-4" style={{ color }}>
                            Change Name
                        </Text>
                        <TextInput
                            value={nameInput}
                            onChangeText={setNameInput}
                            className="bg-gray-800 text-white rounded-xl p-4 text-base mb-6"
                            placeholder="Enter new name"
                            placeholderTextColor={Colors.GRAY}
                        />
                        <View className="flex-row justify-end space-x-3">
                            <TouchableOpacity
                                disabled={loader}
                                className={`p-3 ${loader ? 'opacity-50' : 'opacity-100'}`}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="font-bold text-base" style={{ color }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={loader}
                                className={`p-3 bg-green-500 rounded-xl px-6 ${loader ? 'opacity-50' : 'opacity-100'}`}
                                onPress={handleSave}
                            >
                                <Text className="font-bold text-base" style={{ color: backgroundColor }}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ErrorModal
                visible={error.visible}
                title={error.title}
                message={error.message}
                onConfirm={() => setError((prev) => ({ ...prev, visible: false }))}
            />
        </>
    );
};