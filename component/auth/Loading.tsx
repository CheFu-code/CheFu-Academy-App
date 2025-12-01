import { View, Text, Modal } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { styles } from '@/styles/SignIn.styles';
import { scale } from 'react-native-size-matters';

const Loading = ({ loading }: { loading: boolean }) => {
    return (
        <Modal animationType="fade" transparent={true} visible={loading}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <LottieView
                        source={require('../../assets/animations/GO TO SCHOOL ANIMATION.json')}
                        autoPlay
                        loop
                        style={{ width: scale(150), height: scale(150) }}
                    />
                    <Text style={styles.modalTitle}>Signing you in...</Text>
                    <Text style={styles.modalSubtext}>
                        Just a moment while we load your profile.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default Loading;
