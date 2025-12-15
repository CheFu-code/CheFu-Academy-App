import { styles } from '@/styles/EditProfile.styles';
import { EditProfileProps } from '@/types/editProfile';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Button,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const EditProfile = ({
    backgroundColor,
    textColor,
    safeBack,
    profilePicture,
    fullname,
    setFullname,
    bio,
    setBio,
    country,
    setCountry,
    loading,
    handleSave,
    pickImage,
}: EditProfileProps) => {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <TouchableOpacity
                onPress={() => safeBack()}
                style={styles.backButton}
            >
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
                        top: scale(8),
                        bottom: scale(8),
                        left: scale(8),
                        right: scale(8),
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
                style={[styles.input, { color: textColor }]}
                placeholder="Full Name"
                value={fullname}
                onChangeText={setFullname}
                placeholderTextColor={textColor}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
                placeholderTextColor={textColor}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                placeholderTextColor={textColor}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <Button title="Save Changes" onPress={handleSave} />
            )}
        </SafeAreaView>
    );
};

export default EditProfile;
