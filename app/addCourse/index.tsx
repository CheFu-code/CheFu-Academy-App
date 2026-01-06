import GeneratingTopic from '@/component/AddCourse/GeneratingTopic';
import Loading from '@/component/AddCourse/Loading';
import HeaderText from '@/component/common/Header';
import ErrorModal from '@/component/Shared/ErrorModal';
import { useAddCourseHook } from '@/handlers/AddCourse/addCourseFunction';
import useDarkMode from '@/hooks/useDarkMode';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import AppModal from '../../component/Shared/AppModal';
import Button from '../../component/Shared/Button';
import { Colors } from '../../constant/Colors';
import { styles } from '../../styles/AddCourse.styles';

export default function AddCourse() {
    const [loading] = useState(false);
    const { textColor, backgroundColor } = useDarkMode();
    const {
        generateTopic,
        onTopicSelect,
        isTopicSelected,
        onGenerateCourse,
        watchRewardedAd,
    } = useAddCourseHook();
    const [userInput, setUserInput] = useState('');
    const [topics] = useState<string[]>([]);
    const [selectedTopic] = useState<string[]>([]);
    const [generatingTopic] = useState(false);
    const [limitModalVisible, setLimitModalVisible] = useState(false);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    if (generatingTopic) {
        return <GeneratingTopic generatingTopic={generatingTopic} />;
    }

    if (loading) {
        return <Loading loading={loading} />;
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor }}>
                <HeaderText title="Create new course" />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: moderateScale(20),
                        flexGrow: 1,
                        backgroundColor,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.title, { color: textColor }]}>
                            What do you want to learn today?
                        </Text>
                        <Text style={styles.subtitle}>
                            What course do you want to create? (eg: Learn
                            JavaScript)
                        </Text>

                        <TextInput
                            onChangeText={(value) => setUserInput(value)}
                            value={userInput}
                            style={styles.textInput}
                            numberOfLines={3}
                            multiline={true}
                            placeholder="eg: Learn how to bake bread"
                            placeholderTextColor={Colors.GRAY}
                        />

                        <Button
                            text={'Generate Topic'}
                            type="fill"
                            onPress={generateTopic}
                            loading={loading}
                            disabled={generatingTopic || !userInput.trim()}
                            icon={
                                <Ionicons
                                    name="add"
                                    size={scale(15)}
                                    color="#fff"
                                />
                            }
                        />

                        <View style={styles.AB}>
                            {topics.length > 0 && (
                                <Text
                                    style={[
                                        styles.selectTopic,
                                        { color: textColor },
                                    ]}
                                >
                                    Select all topics which you want to add in
                                    this course
                                </Text>
                            )}
                            <View style={styles.topicsContainer}>
                                {topics.map((item, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => onTopicSelect(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.topics,
                                                {
                                                    backgroundColor:
                                                        isTopicSelected(item)
                                                            ? Colors.PRIMARY
                                                            : undefined,
                                                    color: isTopicSelected(item)
                                                        ? Colors.WHITE
                                                        : Colors.GREEN,
                                                },
                                            ]}
                                        >
                                            {item.replace(/^"|"$/g, '')}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {selectedTopic.length > 0 && (
                            <View style={{ marginBottom: moderateScale(30) }}>
                                <Button
                                    loading={loading}
                                    onPress={() => onGenerateCourse()}
                                    text="Generate Course"
                                    disabled={loading}
                                    icon={null}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <ErrorModal
                visible={errorModal.visible}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                onConfirm={() =>
                    setErrorModal({ ...errorModal, visible: false })
                }
            />

            <AppModal
                visible={limitModalVisible}
                title="Daily Limit Reached"
                message="Free users can create up to 3 courses per day. Upgrade for unlimited access, or watch a rewarded ad to create one additional course."
                confirmText="Watch Ad"
                cancelText="Cancel"
                confirmColor={Colors.GREEN}
                onCancel={() => setLimitModalVisible(false)}
                onConfirm={() => {
                    setLimitModalVisible(false);
                    watchRewardedAd();
                }}
            />
        </>
    );
}
