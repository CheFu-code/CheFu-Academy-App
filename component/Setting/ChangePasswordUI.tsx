import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/ChangePassword.styles';
import { AntDesign } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    const scheme = useColorScheme();
    const textColor = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    scheme === 'dark' ? Colors.BG_COLOR : Colors.WHITE,
            }}
        >
            <TouchableOpacity
                onPress={safeBack}
                disabled={loading}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: verticalScale(10),
                }}
            >
                <AntDesign name="left" size={scale(20)} color={textColor} />
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        color: textColor,
                        fontSize: RFValue(18),
                        marginLeft: scale(6),
                    }}
                >
                    Change Password
                </Text>
            </TouchableOpacity>

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
                        <ActivityIndicator size={'small'} color={textColor} />
                    ) : (
                        <Text style={styles.buttonText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChangePasswordUI;
