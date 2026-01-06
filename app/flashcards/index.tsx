import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function Flashcards() {
    const { courseParams } = useLocalSearchParams();
    const { color, backgroundColor } = useDarkMode();
    const course = JSON.parse(courseParams);
    const flashcard = course?.flashcards;
    const [currentPage, setCurrentPage] = useState(0);
    const width = Dimensions.get('screen').width;

    const onMomentumScrollEnd = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);
        setCurrentPage(newIndex);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <Image
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: scale(500),
                }}
                source={require('../../assets/images/graph.png')}
            />
            <View
                style={{
                    position: 'absolute',
                    padding: moderateScale(20),
                    width: '100%',
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <HeaderText title="Flashcards" />
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: RFValue(22),
                            color,
                        }}
                    >
                        {currentPage + 1} of {flashcard?.length}
                    </Text>
                </View>

                <FlatList
                    data={flashcard}
                    pagingEnabled={true}
                    horizontal={true}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                height: moderateScale(500),
                                marginTop: moderateScale(20),
                                display: 'flex',
                            }}
                        >
                            <FlipCard style={styles.flipCard}>
                                <View style={styles.flipFront}>
                                    <Text
                                        style={{
                                            fontFamily: 'outfit-bold',
                                            fontSize: RFValue(20),
                                            textAlign: 'center',
                                            color: Colors.PRIMARY,
                                        }}
                                    >
                                        {item?.front}
                                    </Text>
                                </View>
                                <View style={styles.flipBack}>
                                    <Text
                                        style={{
                                            fontFamily: 'outfit',
                                            fontSize: RFValue(20),
                                            textAlign: 'center',
                                            color: Colors.BLACK,
                                            padding: moderateScale(20),
                                        }}
                                    >
                                        {item?.back}
                                    </Text>
                                </View>
                            </FlipCard>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flipCard: {
        width: Dimensions.get('screen').width * 0.78,
        height: moderateScale(400),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_GRAY,
        borderRadius: scale(20),
        marginHorizontal: Dimensions.get('screen').width * 0.04,
        elevation: 1,
        marginTop: 35,
    },
    flipBack: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        height: '100%',
        backgroundColor: Colors.LIGHT_GREEN,
    },
    flipFront: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 20,
    },
});
