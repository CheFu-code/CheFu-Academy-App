import AppModal from '@/component/Shared/AppModal';
import { useForgotHook } from '@/handlers/auth/forgotPassword/handlerFunction';
import AnimatedText from '@/helpers/animateText';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ErrorModal from '../../component/Shared/ErrorModal';
import { Colors } from '../../constant/Colors';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading] = useState(false);
    const { safeBack, safeReplace } = useSafeNavigation();
    const { handleReset } = useForgotHook();
    const { backgroundColor } = useDarkMode();
    const [successModalVisible, setSuccessModalVisible] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const [errorModalVisible, setErrorModalVisible] = useState({
        visible: false,
        title: '',
        message: '',
    });

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LottieView
                        source={require('../../assets/animations/Forget password animation.json')}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(150),
                            height: verticalScale(150),
                        }}
                    />
                </View>
                <AnimatedText text="Reset Password" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.GRAY}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    disabled={loading || !email.trim()}
                    onPress={handleReset}
                    style={[
                        styles.button,
                        { opacity: loading || !email.trim() ? 0.5 : 1 },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={'white'} />
                    ) : (
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        safeReplace('/auth/signIn');
                    }}
                    style={styles.cancel}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ErrorModal
                visible={errorModalVisible.visible}
                title={errorModalVisible.title}
                message={errorModalVisible.message}
                onConfirm={() =>
                    setErrorModalVisible({
                        ...errorModalVisible,
                        visible: false,
                    })
                }
            />

            <AppModal
                showCancel={false}
                onCancel={null}
                visible={successModalVisible.visible}
                title={successModalVisible.title}
                message={successModalVisible.message}
                onConfirm={() => {
                    setSuccessModalVisible({
                        ...successModalVisible,
                        visible: false,
                    });
                    safeBack();
                }}
            />
        </>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
        justifyContent: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: moderateScale(8),
        padding: moderateScale(15),
        fontSize: RFValue(16),
        color: Colors.WHITE,
        marginBottom: moderateScale(20),
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: moderateScale(15),
        borderRadius: moderateScale(8),
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: RFValue(17),
        textAlign: 'center',
    },
    cancel: {
        marginTop: verticalScale(15),
    },
    cancelText: {
        color: Colors.PRIMARY,
        textAlign: 'center',
        fontSize: RFValue(13),
    },
});
