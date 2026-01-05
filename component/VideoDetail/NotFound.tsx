import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/VideoDetail.styles';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderText from '../common/Header';

const NotFound = () => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.BG_COLOR,
            }}
        >
            <HeaderText title="Back" />
            <View style={styles.loader}>
                <Text style={[styles.title, { color: 'white' }]}>
                    Oops! Video not found
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default NotFound;
