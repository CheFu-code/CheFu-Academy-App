import { AntDesign } from '@expo/vector-icons';
import { doc, updateDoc } from '@react-native-firebase/firestore';

import { interstitial } from '@/config/AdConfig';
import { db } from '@/config/firebaseConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AdEventType } from 'react-native-google-mobile-ads';
import * as Progress from 'react-native-progress';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import Button from '../../component/Shared/Button';
import { Colors } from '../../constant/Colors';

export default function Quiz() {
    const { courseParams } = useLocalSearchParams();
    const { safeBack, safeReplace } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const course = JSON.parse(courseParams);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedOption, setSelectedOption] = useState();
    const quiz = course?.quiz;
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(false);

    const GetProgress = (currentPage) => {
        const percentage = currentPage / quiz?.length;
        return percentage;
    };

    const OnOptionSelect = (selectedChoice) => {
        setResult((prev) => ({
            ...prev,
            [currentPage]: {
                userChoice: selectedChoice,
                isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
                question: quiz[currentPage]?.question,
                correctAns: quiz[currentPage]?.correctAns,
            },
        }));
    };

    const onQuizFinish = async () => {
        setLoading(true);

        try {
            const courseRef = doc(db, 'course', course?.docId);
            await updateDoc(courseRef, {
                quizResult: result,
            });

            const unsubscribe = interstitial.addAdEventsListener(({ type }) => {
                if (type === AdEventType.LOADED) {
                    interstitial.show();
                }
                if (type === AdEventType.CLOSED || type === AdEventType.ERROR) {
                    unsubscribe();
                    safeReplace({
                        pathname: '/quiz/summary',
                        params: {
                            quizResultParam: JSON.stringify(result),
                        },
                    });
                    setLoading(false);
                }
            });

            interstitial.load();
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };

    return (
        <SafeAreaView
            style={{
                backgroundColor,
                flex: 1,
            }}
        >
            <Image
                style={{
                    height: moderateScale(500),
                    width: '100%',
                    position: 'absolute',
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
                    <Pressable onPress={() => safeBack()}>
                        <AntDesign
                            name="left"
                            size={scale(22)}
                            color={textColor}
                        />
                    </Pressable>
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: RFValue(20),
                            color: textColor,
                        }}
                    >
                        {currentPage + 1} of {quiz?.length}
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: moderateScale(30),
                    }}
                >
                    <Progress.Bar
                        progress={GetProgress(currentPage)}
                        color={Colors.GREEN}
                        width={Dimensions.get('screen').width * 0.85}
                    />
                </View>

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={{
                        padding: moderateScale(20),
                        backgroundColor: Colors.BG_GRAY,
                        marginTop: moderateScale(50),
                        height: Dimensions.get('screen').height * 0.55,
                        elevation: 1,
                        borderRadius: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: RFValue(19),
                            fontFamily: 'outfit-bold',
                            textAlign: 'center',
                        }}
                    >
                        {quiz[currentPage]?.question}
                    </Text>

                    {quiz[currentPage]?.options.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedOption(index);
                                OnOptionSelect(item);
                            }}
                            style={{
                                padding: 5,
                                borderWidth: 0.6,
                                borderColor:
                                    selectedOption === index
                                        ? Colors.GREEN
                                        : '#ccc',

                                borderRadius: 15,
                                marginTop: 8,
                                backgroundColor:
                                    selectedOption === index
                                        ? Colors.LIGHT_GREEN
                                        : null,
                            }}
                            key={index}
                        >
                            <Text
                                style={{
                                    fontFamily: 'outfit',
                                    fontSize: 15,
                                    textAlign: 'center',
                                }}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {selectedOption?.toString() &&
                    quiz?.length - 1 > currentPage && (
                        <Button
                            onPress={() => {
                                setCurrentPage(currentPage + 1);
                                setSelectedOption(null);
                            }}
                            text={'Next'}
                            loading={loading}
                            disabled={loading}
                            icon={null}
                        />
                    )}

                {selectedOption?.toString() &&
                    quiz?.length - 1 === currentPage && (
                        <Button
                            onPress={() => onQuizFinish()}
                            text={'Finish'}
                            loading={loading}
                            disabled={loading}
                            icon={null}
                        />
                    )}
            </View>
        </SafeAreaView>
    );
}
