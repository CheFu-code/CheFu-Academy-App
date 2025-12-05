import { Colors } from '@/constant/Colors';
import AnimatedText from '@/helpers/animateText';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SignUp.styles';
import { SignUpUIProps } from '@/types/signUp';
import {
    ActivityIndicator,
    Image,
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
import { scale, verticalScale } from 'react-native-size-matters';

const SignUpUI = ({
    fullName,
    fullNameError,
    setFullName,
    validateFullName,
    setEmail,
    email,
    showPassword,
    password,
    setPassword,
    loading,
    handleSignUp,
    setShowPassword,
    errorMsg,
}: SignUpUIProps) => {
    const { safeReplace } = useSafeNavigation();
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
                        paddingBottom: verticalScale(20),
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            padding: scale(10),
                        }}
                    >
                        <Image
                            source={require('./../../assets/images/logo.png')}
                            style={styles.logo}
                        />
                        <AnimatedText text="Create new account" />
                    </View>
                    <View style={{ alignItems: 'center', padding: scale(10) }}>
                        <TextInput
                            placeholder="Fullname"
                            style={[
                                styles.textInput,
                                fullNameError && { borderColor: 'red' },
                            ]}
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(v) => {
                                const clean = v
                                    .replace(/[^a-zA-Z\s-]/g, '')
                                    .slice(0, 20);
                                setFullName(clean);
                                validateFullName(clean);
                            }}
                            onBlur={() => validateFullName(fullName)}
                            maxLength={20}
                            value={fullName}
                            accessibilityLabel="Full Name"
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                        {fullNameError && (
                            <Text
                                style={{
                                    color: 'red',
                                    marginTop: verticalScale(4),
                                    fontFamily: 'outfit',
                                }}
                            >
                                Name must be 1–20 letters only &apos;A–Z,
                                spaces, hyphens(optional)&apos;.
                            </Text>
                        )}

                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor={Colors.GRAY}
                            onChangeText={(v) => setEmail(v.trim())}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            maxLength={100}
                            value={email}
                            accessibilityLabel="Email Address"
                            returnKeyType="next"
                        />
                        <View style={{ width: '100%', position: 'relative' }}>
                            <TextInput
                                placeholder="Password"
                                style={styles.textInput}
                                placeholderTextColor={Colors.GRAY}
                                secureTextEntry={!showPassword}
                                onChangeText={(v) => setPassword(v)}
                                maxLength={50}
                                value={password}
                                accessibilityLabel="Password"
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    if (!loading) handleSignUp();
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: scale(10),
                                    top: scale(25),
                                }}
                                accessibilityLabel={
                                    showPassword
                                        ? 'Hide Password'
                                        : 'Show Password'
                                }
                                accessibilityRole="button"
                            >
                                <Text
                                    style={[
                                        styles.showPassword,
                                        {
                                            color:
                                                showPassword === true
                                                    ? Colors.GREEN
                                                    : Colors.PRIMARY,
                                        },
                                    ]}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {errorMsg ? (
                            <Text
                                style={{
                                    color: 'red',
                                    marginTop: verticalScale(10),
                                    textAlign: 'center',
                                }}
                                accessibilityLiveRegion="polite"
                            >
                                {errorMsg}
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={[
                                styles.button,
                                {
                                    opacity:
                                        loading ||
                                        !email ||
                                        !password ||
                                        !fullName
                                            ? 0.4
                                            : 1,
                                },
                            ]}
                            disabled={
                                loading || !email || !password || !fullName
                            }
                        >
                            {!loading ? (
                                <Text style={styles.buttonText}>
                                    Create Account
                                </Text>
                            ) : (
                                <ActivityIndicator
                                    color={'white'}
                                    size={'large'}
                                />
                            )}
                        </TouchableOpacity>

                        <View
                            style={{
                                flexDirection: 'row',
                                gap: scale(3),
                                marginTop: verticalScale(20),
                            }}
                        >
                            <Text style={{ color: Colors.WHITE }}>
                                Already have an account?{' '}
                            </Text>

                            <Pressable
                                onPress={() => safeReplace('/auth/signIn')}
                            >
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>

                        {/* <Pressable disabled={loading}>
                            <Text style={styles.conditions}>
                                By signing up, you agree to our{' '}
                                <Text
                                    style={{
                                        color: Colors.YELLOW,
                                        textDecorationLine: 'underline',
                                    }}
                                    onPress={() => safePush('/terms')}
                                >
                                    Terms of Service
                                </Text>{' '}
                                and{' '}
                                <Text
                                    style={{
                                        color: Colors.YELLOW,
                                        textDecorationLine: 'underline',
                                    }}
                                    onPress={() => safePush(`${process.env.EXPO_PUBLIC_BASE_URL}/privacy`)}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </Pressable> */}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpUI;
