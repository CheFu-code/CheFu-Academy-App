import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { showToast } from '@/utils/toast';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from '@react-native-firebase/auth';
import {
    doc,
    getFirestore,
    serverTimestamp,
    setDoc,
} from '@react-native-firebase/firestore';
import { useContext, useState } from 'react';
import {
    Linking,
    Modal,
    Pressable,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/Header.styles';
import AddVideoModal from './AddVideoModal';
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export default function Header({ onPress }: { onPress?: () => void }) {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { safePush, safeReplace } = useSafeNavigation();
    const db = getFirestore();
    const auth = getAuth();
    const CACHE_KEY = '@cached_courses';
    const handleOption = async (option: string) => {
        setShowModal(false);

        if (option === 'Logout') {
            try {
                await signOut(auth);
                await AsyncStorage.removeItem('userDetail');
                await AsyncStorage.removeItem(CACHE_KEY);
                console.log('async storage removed');
                setUserDetail(null);
                ToastAndroid.show(
                    'Logged out successfully',
                    ToastAndroid.SHORT,
                );
                safeReplace('/auth/signIn');
            } catch (error: unknown) {
                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    typeof (error as any).code === 'string'
                ) {
                    const code = (error as any).code;

                    if (code === 'auth/no-current-user') {
                        ToastAndroid.show(
                            "You're not logged in",
                            ToastAndroid.SHORT,
                        );
                    } else if (code === 'auth/user-not-found') {
                        ToastAndroid.show('User not found', ToastAndroid.SHORT);
                    } else if (code === 'auth/network-request-failed') {
                        ToastAndroid.show(
                            'Network error, please try again',
                            ToastAndroid.SHORT,
                        );
                    } else if (code === 'auth/too-many-requests') {
                        ToastAndroid.show(
                            'Too many requests, please try again later',
                            ToastAndroid.SHORT,
                        );
                    } else if (code === 'auth/operation-not-allowed') {
                        ToastAndroid.show(
                            'Operation not allowed',
                            ToastAndroid.SHORT,
                        );
                    } else {
                        ToastAndroid.show(
                            'An error occurred, please try again',
                            ToastAndroid.SHORT,
                        );
                        console.error('Logout error on header:', error);
                    }
                } else {
                    // Unknown error type or no code property
                    ToastAndroid.show(
                        'An error occurred, please try again',
                        ToastAndroid.SHORT,
                    );
                    console.error('Logout error on header:', error);
                }
            }
        } else if (option === 'Rate our app') {
            // Handle rate our app action
            const url =
                'https://play.google.com/store/apps/details?id=com.chefu.chefuacademy';
            Linking.openURL(url).catch((err) => {
                console.error('Failed to open URL:', err);
                ToastAndroid.show(
                    'Failed to open Google Play store',
                    ToastAndroid.SHORT,
                );
            });
        } else if (option === 'View Profile') {
            safePush('/(tabs)/profile');
        } else if (option === 'Contact Support') {
            Linking.openURL(
                'mailto:kurisanimaluleke77@gmail.com?subject=Support Request&body=Please describe your issue here.',
            );
        } else if (option === 'Add Course') {
            safePush('/addCourse');
        } else if (option === 'Favorite Videos') {
            safePush('/favoriteVideos');
        }
    };

    const modalOptions: {
        label: string;
        icon: IoniconsName;
        color?: string;
    }[] = [
        { label: 'Add Course', icon: 'add-circle-outline' },
        { label: 'Favorite Videos', icon: 'heart' },
        { label: 'Contact Support', icon: 'mail-outline' },
        { label: 'Rate our app', icon: 'star-outline', color: Colors.YELLOW },
    ];

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            ToastAndroid.show('Please enter a search term', ToastAndroid.SHORT);
            return;
        }

        safePush({
            pathname: '/searchResults',
            params: { query: searchTerm.trim() },
        });
        setSearchTerm('');
    };

    const handleSaveVideo = async (videoData: any) => {
        if (!videoData || !videoData.videoId) return;

        try {
            const videoRef = doc(db, 'youTubeVideos', videoData.videoId);

            await setDoc(videoRef, {
                title: videoData.title,
                thumbnailURL: videoData.thumbnailURL,
                videoId: videoData.videoId,
                createdAt: serverTimestamp(),
                category: videoData.category,
            });

            showToast('Video saved successfully!');
        } catch (error) {
            console.error('Error saving video:', error);
            showToast('Failed to save video');
        }
    };

    return (
        <View style={styles.headerContainer}>
            <View>
                <View
                    style={[
                        styles.subHeaderContainer,
                        {
                            marginTop:
                                auth.currentUser &&
                                !auth.currentUser.emailVerified
                                    ? 0
                                    : 20,
                        },
                    ]}
                >
                    <Pressable
                        onLongPress={() => {
                            if (userDetail?.roles.includes('admin')) {
                                setModalVisible(true);
                            } else {
                                return;
                            }
                        }}
                        onPress={onPress}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={styles.greeting}
                        >
                            Hello
                            {userDetail?.fullname && (
                                <Text style={{ fontFamily: 'outfit-bold' }}>
                                    , {userDetail.fullname}
                                </Text>
                            )}
                        </Text>

                        {userDetail?.member === true && (
                            <Ionicons
                                color={Colors.PRIMARY}
                                size={15}
                                name="checkmark-circle"
                            />
                        )}
                    </Pressable>

                    {userDetail && (
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                            <Feather
                                style={styles.showMoreIcon}
                                name="more-horizontal"
                                size={18}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={[styles.text, { fontSize: 14 }]}
                    >
                        Expand your knowledge with our courses
                    </Text>
                </View>

                {/*text input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search courses, topics, instructors..."
                        placeholderTextColor={Colors.BLACK}
                        autoCorrect={false}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearch}
                        autoCapitalize="none"
                        style={[styles.text, { flex: 1, fontFamily: 'outfit' }]}
                    />
                    {searchTerm.trim() && (
                        <TouchableOpacity onPress={() => handleSearch()}>
                            <Ionicons
                                style={styles.search}
                                size={20}
                                color={Colors.GREEN}
                                name="search"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal
                transparent
                visible={showModal}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable
                    onPress={() => setShowModal(false)}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalSheet}>
                        <Text style={styles.modalTitle}>Options</Text>

                        {modalOptions.map(({ label, icon, color }) => (
                            <TouchableOpacity
                                key={label}
                                onPress={() => handleOption(label)}
                                style={styles.modalItem}
                            >
                                <Ionicons
                                    name={icon}
                                    size={24}
                                    color={color || Colors.PRIMARY}
                                    style={styles.modalIcon}
                                />
                                <Text
                                    style={[
                                        styles.modalText,
                                        color && { color },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            <AddVideoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveVideo}
            />
        </View>
    );
}
