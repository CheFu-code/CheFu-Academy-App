import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/VideoDetail.styles';
import { AntDesign } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';

const NotFound = ({ safeBack }: { safeBack: () => void }) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.BG_COLOR,
            }}
        >
            <TouchableOpacity
                onPress={safeBack}
                style={{ flexDirection: 'row', alignItems: 'center' }}
            >
                <AntDesign
                    name="left"
                    color={'white'}
                    size={moderateScale(20)}
                />
                <Text style={{ color: Colors.WHITE, fontSize: RFValue(20) }}>
                    Back
                </Text>
            </TouchableOpacity>
            <View style={styles.loader}>
                <Text style={[styles.title, { color: 'white' }]}>
                    Oops! Video not found
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default NotFound;
