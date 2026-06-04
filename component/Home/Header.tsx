import { db } from '@/config/firebaseConfig';
import { useHandles } from '@/handlers/Header/handleFunctions';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    collection,
    onSnapshot,
    query,
    where,
} from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/Header.styles';
import AddVideoModal from './AddVideoModal';
import ModalOptions from './Header/modalOptions';

export default function Header({ onPress }: { onPress?: () => void }) {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { handleSearch, handleOption, handleSaveVideo } = useHandles();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!userDetail) return;

        const q = query(
            collection(db, 'notifications'),
            where('to', '==', userDetail.uid),
            where('read', '==', false),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [userDetail]);

    return (
        <View style={styles.headerContainer}>
            <View>
                <View
                    style={[
                        styles.subHeaderContainer,
                        {
                            marginTop: scale(18),
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
                            gap: scale(5),
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
                                size={scale(15)}
                                name="checkmark-circle"
                            />
                        )}
                    </Pressable>

                    {userDetail && (
                        <View style={styles.bellCont}>
                            <TouchableOpacity
                                style={{ position: 'relative' }}
                                onPress={() => {
                                    safePush('/notification');
                                }}
                            >
                                <Feather
                                    name="bell"
                                    size={scale(20)}
                                    color="white"
                                />

                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unreadCount > 99
                                                ? '99+'
                                                : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowModal(true)}
                            >
                                <Feather
                                    style={styles.showMoreIcon}
                                    name="more-horizontal"
                                    size={scale(16)}
                                    color={'white'}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={[styles.text, { fontSize: RFValue(12) }]}
                    >
                        Expand your knowledge with our courses
                    </Text>
                </View>

                {/*text input */}
                <View style={styles.inputContainer}>
                    {searchTerm.trim() && (
                        <TouchableOpacity onPress={() => handleSearch()}>
                            <Ionicons
                                style={styles.search}
                                size={scale(18)}
                                color={Colors.GREEN}
                                name="search"
                            />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        placeholder="Search courses, videos..."
                        placeholderTextColor={Colors.BLACK}
                        autoCorrect={false}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearch}
                        autoCapitalize="none"
                        style={[styles.text, { flex: 1, fontFamily: 'outfit' }]}
                    />
                    {searchTerm.trim() !== '' && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <MaterialIcons
                                size={scale(18)}
                                color={Colors.BLACK}
                                name="cancel"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ModalOptions handleOption={handleOption} />
            <AddVideoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveVideo}
            />
        </View>
    );
}
