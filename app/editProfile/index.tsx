import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';

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

            // Upload new profile picture if changed
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

            <TouchableOpacity style={styles.avatarCont} onPress={pickImage}>
                <Image
                    source={
                        profilePicture
                            ? { uri: profilePicture }
                            : require('../../assets/images/avatar.jpg')
                    }
                    style={styles.avatar}
                />
                <EvilIcons name="camera" size={scale(20)} color={textColor} />
            </TouchableOpacity>

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

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: moderateScale(15) },
    title: {
        fontSize: RFValue(20),
        fontFamily: 'outfit-bold',
    },
    avatar: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: scale(50),
        alignSelf: 'center',
        marginBottom: moderateScale(10),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    avatarCont: {},
});
