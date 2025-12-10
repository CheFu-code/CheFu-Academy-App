import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/EditProfile.styles';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function EditProfileScreen() {
    const { userDetail } = useContext(UserDetailContext);
    const { textColor, backgroundColor } = useDarkMode();
    const [fullname, setFullname] = useState(userDetail?.fullname || '');
    const [bio, setBio] = useState(userDetail?.bio || '');
    const [country, setCountry] = useState(userDetail?.country || '');
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(
        userDetail?.profilePicture || '',
    );

    useEffect(() => {
        if (userDetail) {
            setFullname(userDetail.fullname || '');
            setBio(userDetail.bio || '');
            setCountry(userDetail.country || '');
            setProfilePicture(userDetail.profilePicture || '');
        }
    }, [userDetail]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!userDetail) return;

        setLoading(true);
        try {
            let photoURL = profilePicture;

            if (
                profilePicture &&
                profilePicture !== userDetail.profilePicture
            ) {
                const ref = storage().ref(
                    `profilePictures/${userDetail.uid}.jpg`,
                );
                await ref.putFile(profilePicture);
                photoURL = await ref.getDownloadURL();
            }

            await firestore().collection('users').doc(userDetail.uid).update({
                fullname,
                bio,
                country,
                profilePicture: photoURL,
                updatedAt: FirebaseFirestoreTypes.Timestamp.now(),
            });

            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <TouchableOpacity style={styles.backButton}>
                <AntDesign name="left" color={textColor} size={scale(20)} />
                <Text style={[styles.title, { color: textColor }]}>
                    Edit Profile
                </Text>
            </TouchableOpacity>

            <View style={styles.avatarCont}>
                <Image
                    source={
                        profilePicture
                            ? { uri: profilePicture }
                            : require('../../assets/images/avatar.jpg')
                    }
                    style={styles.avatar}
                />
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.cameraBtn}
                    hitSlop={{
                        top: scale(10),
                        bottom: scale(10),
                        left: scale(10),
                        right: scale(10),
                    }}
                    activeOpacity={0.8}
                >
                    <EvilIcons
                        name="camera"
                        size={scale(20)}
                        color={textColor}
                    />
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullname}
                onChangeText={setFullname}
            />
            <TextInput
                style={styles.input}
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <Button title="Save Changes" onPress={handleSave} />
            )}
        </SafeAreaView>
    );
}


