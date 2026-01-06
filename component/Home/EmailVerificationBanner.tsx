import { auth } from '@/config/firebaseConfig';
import { Colors } from '@/constant/Colors';
import { sendEmailVerification } from '@react-native-firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AppModal from '../Shared/AppModal';
import ErrorModal from '../Shared/ErrorModal';

export default function EmailVerificationBanner() {
    const [sending, setSending] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const [errorNewModal, setErrorNewModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    const verify = async () => {
        const user = auth.currentUser;
        if (!user) {
            setErrorModal({
                visible: true,
                title: 'Not Signed In',
                message: 'You are currently not signed in.',
            });
            return;
        }

        setSending(true);
        try {
            await sendEmailVerification(user);
            setVerifyEmail({
                visible: true,
                title: 'Email Verification Sent',
                message: `Verification email sent to ${
                    user?.email ?? 'your email'
                }. Check your inbox and spam folder.`,
            });
        } catch (error: unknown) {
            console.error('Failed to send verification email:', error);

            let errorMessage =
                'Failed to send verification email. Please try again later.';

            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                typeof (error as { code?: unknown }).code === 'string'
            ) {
                if (
                    (error as { code: string }).code ===
                    'auth/too-many-requests'
                ) {
                    errorMessage = 'Too many requests. Please try again later.';
                }
            }

            setErrorNewModal({
                visible: true,
                title: 'Error',
                message: errorMessage,
            });
        } finally {
            setSending(false);
        }
    };

    if (!auth.currentUser || auth.currentUser.emailVerified) return null;

    return sending ? (
        <ActivityIndicator color={Colors.GREEN} />
    ) : (
        <>
            <View style={{ backgroundColor: Colors.BG, paddingTop: 22 }}>
                <TouchableOpacity
                    onPress={verify}
                    style={{
                        backgroundColor: '#FFD700',
                        padding: 5,
                        borderRadius: 15,
                        opacity: 0.9,
                    }}
                >
                    <Text
                        style={{
                            color: '#000',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Please verify your email address to access all features.
                    </Text>
                </TouchableOpacity>
            </View>

            <AppModal
                visible={verifyEmail.visible}
                title={verifyEmail.title}
                message={verifyEmail.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setVerifyEmail((prev) => ({ ...prev, visible: false }))
                }
                onCancel={() =>
                    setVerifyEmail((prev) => ({ ...prev, visible: false }))
                }
            />

            <AppModal
                visible={errorModal.visible}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setErrorModal((prev) => ({ ...prev, visible: false }))
                }
                onCancel={() =>
                    setErrorModal((prev) => ({ ...prev, visible: false }))
                }
            />
            <ErrorModal
                visible={errorNewModal.visible}
                title={errorNewModal.title}
                message={errorNewModal.message}
                confirmText="OK"
                onConfirm={() =>
                    setErrorNewModal((prev) => ({ ...prev, visible: false }))
                }
            />
        </>
    );
}
