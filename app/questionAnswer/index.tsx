import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import { Course, QA } from '@/types/course';
import { parseJsonRouteParam } from '@/utils/routeParams';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export default function QuestionAnswer() {
    const { courseParams } = useLocalSearchParams();
    const { color, backgroundColor } = useDarkMode();
    const course = parseJsonRouteParam<Partial<Course>>(courseParams, {});
    const qaList = course?.qa || [];
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(
        null,
    );

    const getQuestionAnswer = (index: number) => {
        if (selectedQuestion === index) {
            setSelectedQuestion(null);
        } else {
            setSelectedQuestion(index);
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor,
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
                    padding: moderateScale(20),
                    marginBottom: moderateScale(20),
                    flex: 1,
                }}
            >
                <HeaderText title="Question & Answer" />
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(16),
                        color,
                        marginTop: 10,
                        textAlign: 'center',
                        marginBottom: moderateScale(10),
                    }}
                >
                    {course?.courseTitle}
                </Text>

                <FlatList
                    contentContainerStyle={{ paddingBottom: moderateScale(22) }}
                    showsVerticalScrollIndicator={false}
                    data={qaList}
                    renderItem={({ item, index }: { item: QA; index: number }) => (
                        <Pressable
                            onPress={() => getQuestionAnswer(index)}
                            // key={index}
                            style={styles.card}
                        >
                            <Text
                                style={{
                                    fontFamily: 'outfit-bold',
                                    fontSize: 16,
                                    color: Colors.BLACK,
                                }}
                            >
                                {item.question}
                            </Text>
                            {selectedQuestion === index && (
                                <View style={styles.codeBlock}>
                                    <Text style={styles.codeLabel}>
                                        Answer:
                                    </Text>
                                    <Text style={styles.codeText}>
                                        {item.answer}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    )}
                    keyExtractor={(item, index) =>
                        item.id ? String(item.id) : String(index)
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        elevation: 1,
    },
    codeBlock: {
        backgroundColor: '#1e1e1e', // like VS Code dark theme
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
    },
    codeLabel: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
        fontSize: 14,
        marginBottom: 4,
    },
    codeText: {
        color: '#d4d4d4',
        fontFamily: 'outfit', // or any monospace font you have
        fontSize: 13,
    },
});
