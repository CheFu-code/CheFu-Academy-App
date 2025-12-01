import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../component/Shared/Button';
import { Colors } from '../../constant/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

export default function QuizSummary() {
    const { quizResultParam } = useLocalSearchParams();
    const quizResult = JSON.parse(quizResultParam);
    const [correctAns, setCorrectAns] = useState(0);
    const [totalQuestion, setTotalQuestion] = useState(0);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        quizResult && calculateResult();
    }, [quizResult]);

    const calculateResult = () => {
        if (quizResult !== undefined) {
            const correctAns_ = Object.entries(quizResult)?.filter(
                ([key, value]) => value?.isCorrect === true,
            );
            const totalQues_ = Object.keys(quizResult).length;
            setCorrectAns(correctAns_.length);
            setTotalQuestion(totalQues_);
        }
    };

    const getPercentageMark = () => {
        return ((correctAns / totalQuestion) * 100).toFixed(0);
    };

    const incorrectAns = totalQuestion - correctAns;

    return (
        <View
            style={{
                backgroundColor: Colors.BG_COLOR,
                flex: 1,
            }}
        >
            <Image
                style={{
                    width: '100%',
                    height: 500,
                }}
                source={require('../../assets/images/graph.png')}
            />
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    padding: 35,
                    marginTop: 30,
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: 'outfit-bold',
                        color: Colors.PRIMARY,
                        fontSize: RFValue(20),
                    }}
                >
                    Quiz Summary
                </Text>
                <View
                    style={{
                        backgroundColor: Colors.BG_GRAY,
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 40,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {getPercentageMark() > 60 && (
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                marginTop: -55,
                            }}
                            source={require('../../assets/images/trophy.png')}
                        />
                    )}

                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: RFValue(20),
                        }}
                    >
                        {getPercentageMark() > 60
                            ? 'Congratulation!'
                            : 'Try again!'}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(15),
                            color:
                                getPercentageMark() >= 60
                                    ? Colors.GREEN
                                    : Colors.RED,
                        }}
                    >
                        You scored {getPercentageMark()}%
                    </Text>

                    <View>
                        <View style={styles.resultTextContainer}>
                            <Text style={styles.resultText}>
                                Total Question: {totalQuestion}
                            </Text>
                            <MaterialCommunityIcons
                                name="file-question-outline"
                                size={20}
                                color={Colors.PRIMARY}
                            />
                        </View>

                        <View style={styles.resultTextContainer}>
                            <Text style={styles.resultText}>
                                Correct Answers: {correctAns}
                            </Text>
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={Colors.GREEN}
                            />
                        </View>

                        <View style={styles.resultTextContainer}>
                            <Text style={styles.resultText}>
                                Incorrect Answers: {incorrectAns}
                            </Text>
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={Colors.RED}
                            />
                        </View>
                    </View>
                </View>
                <Button
                    loading={loading}
                    onPress={() => router.replace('/(tabs)/home')}
                    text={'Back to Home'}
                    disabled={loading}
                />
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(15),
                        marginTop: 20,
                        color: Colors.WHITE,
                    }}
                >
                    Summary:
                </Text>
                <View
                    style={{
                        marginTop: 10,
                        backgroundColor: Colors.BG_GRAY,
                        maxHeight: 250,
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY,
                        padding: 10,
                    }}
                >
                    <FlatList
                        data={Object.entries(quizResult)}
                        keyExtractor={([key]) => key}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const quizItem = item[1];
                            return (
                                <View
                                    style={{
                                        paddingVertical: 8,
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: Colors.BLACK,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'outfit-bold',
                                            fontSize: RFValue(14),
                                            color: quizItem.isCorrect
                                                ? Colors.GREEN
                                                : Colors.LIGHT_RED,
                                            flex: 1,
                                            marginLeft: 10,
                                        }}
                                    >
                                        {quizItem.question}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: RFValue(16),
                                            color: quizItem.isCorrect
                                                ? Colors.GREEN
                                                : 'red',
                                        }}
                                    >
                                        {quizItem.isCorrect ? (
                                            <Ionicons
                                                name="checkmark-outline"
                                                size={24}
                                            />
                                        ) : (
                                            <Entypo name="cross" size={24} />
                                        )}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    resultTextContainer: {
        padding: 10,
        backgroundColor: Colors.LIGHT_GREEN,
        elevation: 1,
        borderRadius: 15,
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        borderWidth: 0.6,
    },
    resultText: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(13),
    },
});
