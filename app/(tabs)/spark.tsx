import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';
import SparksFeed from '@/component/Home/SparksFeed';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

const Spark = () => {
    const { safePush } = useSafeNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Spark Feed</Text>
                <TouchableOpacity onPress={() => safePush('/addSpark')}>
                    <MaterialIcons
                        name="post-add"
                        color={'white'}
                        size={scale(20)}
                    />
                </TouchableOpacity>
            </View>

            <SparksFeed />
        </SafeAreaView>
    );
};

export default Spark;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
    },
    title: {
        color: Colors.WHITE,
        fontSize: RFValue(22),
        fontWeight: 'bold',
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: verticalScale(10),
    },
});
