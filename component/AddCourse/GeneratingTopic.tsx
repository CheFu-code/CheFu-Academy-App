import useDarkMode from '@/hooks/useDarkMode';
import LottieView from 'lottie-react-native';
import { Modal, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { styles } from '../../styles/AddCourse.styles';

const GeneratingTopic = ({ generatingTopic }: { generatingTopic: boolean }) => {
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={generatingTopic}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor }]}>
                    <LottieView
                        source={require('./../../assets/animations/Brainstorm.json')}
                        autoPlay
                        loop
                        style={{
                            width: scale(150),
                            height: verticalScale(150),
                        }}
                    />
                    <Text style={styles.modalTitle}>Generating Topics.</Text>
                    <Text style={[styles.modalSubtext, { color: textColor }]}>
                        Our AI is working to deliver personalized learning
                        topics.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default GeneratingTopic;
