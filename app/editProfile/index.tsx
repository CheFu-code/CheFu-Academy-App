import EditProfile from '@/component/Profile/EditProfileUI';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import {
    Alert
} from 'react-native';

export default function EditProfileScreen() {
    const { userDetail } = useContext(UserDetailContext);
    const { safeBack } = useSafeNavigation();
    const { color, backgroundColor } = useDarkMode();
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
        <EditProfile
            backgroundColor={backgroundColor}
            color={color}
            safeBack={safeBack}
            profilePicture={profilePicture}
            fullname={fullname}
            setFullname={setFullname}
            bio={bio}
            setBio={setBio}
            country={country}
            setCountry={setCountry}
            loading={loading}
            handleSave={handleSave}
            pickImage={pickImage}
        />
    );
}