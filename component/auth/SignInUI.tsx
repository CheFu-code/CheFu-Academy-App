import { Colors } from '@/constant/Colors';
import AnimatedText from '@/helpers/animateText';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SignIn.styles';
import { SignInUIProps } from '@/types/signIn';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale } from 'react-native-size-matters';

const SignInUI = ({
    setEmail,
    setEmailError,
    setPassword,
    setPasswordError,
    emailError,
    showPassword,
    passwordError,
    setShowPassword,
    loading,
    handleSignIn,
    email,
    password,
}: SignInUIProps) => {
    const { safePush, safeReplace } = useSafeNavigation();
    const google = () => {
        safeReplace('/auth/google');
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={verticalScale(30)}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingBottom: verticalScale(40),
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            paddingTop: verticalScale(30),
                            padding: scale(20),
                        }}
                    >
                        <LottieView
                            autoPlay
                            loop={true}
                            source={require('./../../assets/animations/Login.json')}
                            style={styles.lottieView}
                        />
                        <AnimatedText text="Welcome back" />

                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(value) => {
                                setEmail(value.trim());
                                if (emailError) setEmailError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? (
                            <Text
                                style={{
                                    color: 'red',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {emailError}
                            </Text>
                        ) : null}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={Colors.GRAY}
                                secureTextEntry={!showPassword}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    if (passwordError) setPasswordError('');
                                }}
                                autoCapitalize="none"
                                style={styles.passwordInput}
                                onSubmitEditing={() => {
                                    if (!loading) handleSignIn();
                                }}
                            />

                            <Pressable
                                onPress={() => setShowPassword((prev) => !prev)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={scale(22)}
                                    color={Colors.PRIMARY}
                                />
                            </Pressable>
                        </View>
                        {passwordError ? (
                            <Text
                                style={{
                                    color: 'red',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {passwordError}
                            </Text>
                        ) : null}

                        <Pressable
                            onPress={() => safePush('/auth/forgotPassword')}
                            style={{
                                alignSelf: 'flex-end',
                                marginTop: verticalScale(8),
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.PRIMARY,
                                    fontWeight: 'bold',
                                }}
                            >
                                Forgot Password?
                            </Text>
                        </Pressable>

                        <TouchableOpacity
                            style={styles.iconsContainer}
                            onPress={() => google()}
                        >
                            <AntDesign
                                style={styles.icons}
                                name="google"
                                size={scale(20)}
                                color={'white'}
                            />
                            <Text
                                style={{
                                    fontSize: RFValue(15),
                                    fontFamily: 'outfit',
                                    color: 'white',
                                }}
                            >
                                Google
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.signInButtonContainer,
                                {
                                    opacity:
                                        loading || !email || !password
                                            ? 0.4
                                            : 1,
                                },
                            ]}
                            onPress={handleSignIn}
                            disabled={loading || !email || !password}
                        >
                            {!loading ? (
                                <Text style={styles.signInButton}>Sign In</Text>
                            ) : (
                                <ActivityIndicator color="white" size="large" />
                            )}
                        </TouchableOpacity>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: verticalScale(16),
                            }}
                        >
                            <Text style={{ color: Colors.WHITE }}>
                                Don&apos;t have an account?{' '}
                            </Text>
                            <Pressable
                                onPress={() => safeReplace('/auth/signUp')}
                            >
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignInUI;
