import SparksFeed from '@/component/Home/SparksFeed';
import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';

const Spark = () => {
    const { safePush } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Spark Feed</Text>
                <TouchableOpacity onPress={() => safePush('/addSpark')}>
                    <MaterialIcons
                        name="post-add"
                        color={textColor}
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
    },
    title: {
        color: Colors.PRIMARY,
        fontSize: RFValue(20),
        fontWeight: 'bold',
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
    },
});
