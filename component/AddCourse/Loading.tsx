import LottieView from 'lottie-react-native';
import { Modal, Text, View } from 'react-native';
import { styles } from '../../styles/AddCourse.styles';

const Loading = ({ loading }: { loading: boolean }) => {
    return (
        <Modal animationType="fade" transparent={true} visible={loading}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <LottieView
                        source={require('./../../assets/animations/generatingTopic.json')}
                        autoPlay
                        loop
                        style={{ width: 190, height: 190 }}
                    />
                    <Text style={styles.modalTitle}>Let the Genius Work</Text>
                    <Text style={styles.modalSubtext}>
                        Powered by CheFu Inc., our advanced AI is crafting your
                        course with precision, efficiency, and a personalized
                        touch—designed exclusively for you.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

export default Loading;
