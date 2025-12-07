import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/ChangePassword.styles';
import { AntDesign } from '@expo/vector-icons';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';
import { JSX } from 'react/jsx-runtime';

interface ChangePasswordUIProps {
    handleChangePassword: () => void;
    loading: boolean;
    currentPassword: string;
    setCurrentPassword: (text: string) => void;
    newPassword: string;
    setNewPassword: (text: string) => void;
    confirmPassword: string;
    setConfirmPassword: (text: string) => void;
    safeBack: () => void;
    renderInput: (
        label: string,
        value: string,
        setter: (text: string) => void,
        field: 'current' | 'new' | 'confirm',
    ) => JSX.Element;
}

const ChangePasswordUI = ({
    handleChangePassword,
    loading,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    safeBack,
    renderInput,
}: ChangePasswordUIProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}
        >
            <SafeAreaView>
                <TouchableOpacity
                    onPress={safeBack}
                    disabled={loading}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: verticalScale(10),
                        marginLeft: verticalScale(10),
                    }}
                >
                    <AntDesign name="left" size={scale(20)} color="#fff" />
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            color: '#fff',
                            fontSize: RFValue(18),
                            marginLeft: scale(6),
                        }}
                    >
                        Change Password
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.container}>
                {renderInput(
                    'Current Password',
                    currentPassword,
                    setCurrentPassword,
                    'current',
                )}
                {renderInput(
                    'New Password',
                    newPassword,
                    setNewPassword,
                    'new',
                )}
                {renderInput(
                    'Confirm New Password',
                    confirmPassword,
                    setConfirmPassword,
                    'confirm',
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            opacity:
                                loading ||
                                !currentPassword ||
                                !newPassword ||
                                !confirmPassword
                                    ? 0.5
                                    : 1,
                        },
                    ]}
                    onPress={handleChangePassword}
                    disabled={
                        loading ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                    }
                >
                    {loading ? (
                        <ActivityIndicator size={'small'} color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChangePasswordUI;
