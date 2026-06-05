import { AntDesign } from '@expo/vector-icons';
import { doc, updateDoc } from '@react-native-firebase/firestore';

import { interstitial } from '@/config/AdConfig';
import { db } from '@/config/firebaseConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { parseJsonRouteParam } from '@/utils/routeParams';
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

type QuizResultItem = {
    correctAns?: string;
    isCorrect: boolean;
    question?: string;
    userChoice: string;
};

export default function Quiz() {
    const { courseParams } = useLocalSearchParams();
    const { safeBack, safeReplace } = useSafeNavigation();
    const { color, backgroundColor } = useDarkMode();
    const course = parseJsonRouteParam<Partial<Course>>(courseParams, {});
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const quiz = course?.quiz || [];
    const currentQuiz = quiz[currentPage];
    const hasSelection = selectedOption !== null;
    const [result, setResult] = useState<Record<number, QuizResultItem>>({});
    const [loading, setLoading] = useState(false);

    const getProgress = (page: number) => {
        if (!quiz.length) return 0;
        return page / quiz.length;
    };

    const onOptionSelect = (selectedChoice: string) => {
        setResult((prev) => ({
            ...prev,
            [currentPage]: {
                userChoice: selectedChoice,
                isCorrect: currentQuiz?.correctAns === selectedChoice,
                question: currentQuiz?.question,
                correctAns: currentQuiz?.correctAns,
            },
        }));
    };

    const onQuizFinish = async () => {
        if (!course?.docId) return;
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
                            color={color}
                        />
                    </Pressable>
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: RFValue(20),
                            color,
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
                        progress={getProgress(currentPage)}
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
                        {currentQuiz?.question}
                    </Text>

                    {currentQuiz?.options.map((item: string, index: number) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedOption(index);
                                onOptionSelect(item);
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
                                        : undefined,
                            }}
                            key={`${item}-${index}`}
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
                {hasSelection &&
                    quiz.length - 1 > currentPage && (
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

                {hasSelection &&
                    quiz.length - 1 === currentPage && (
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
