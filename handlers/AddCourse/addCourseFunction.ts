import { rewardedAd } from '@/config/AdConfig';
import { generateCourse, generateTopics } from '@/config/AiModel';
import { db } from '@/config/firebaseConfig';
import Prompt from '@/constant/Prompt';
import { support } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { handleAiError } from '@/utils/errorUtils';
import { checkDailyLimit } from '@/utils/firestoreUtils';
import { showToast } from '@/utils/toast';
import { doc, setDoc } from '@react-native-firebase/firestore';
import * as Sentry from '@sentry/react-native';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import {
    AdEventType,
    RewardedAdEventType,
} from 'react-native-google-mobile-ads';

export const useAddCourseHook = () => {
    const { userDetail } = useContext(UserDetailContext);
    const { safeReplace } = useSafeNavigation();
    const [topics, setTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
    const [generatingTopic, setGeneratingTopic] = useState(false);
    const [limitModalVisible, setLimitModalVisible] = useState(false);
    const [extraCourseUnlocked, setExtraCourseUnlocked] = useState(false);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const generateTopic = async () => {
        if (generatingTopic) return; // Prevent double submission
        if (!userInput.trim()) {
            setErrorModal({
                visible: true,
                title: 'Input Required',
                message: 'Please enter a course idea first.',
            });
            return;
        }

        setGeneratingTopic(true);

        try {
            const courseCountToday = await checkDailyLimit(userDetail?.email);
            if (
                userDetail?.member === false &&
                courseCountToday >= 3 &&
                !extraCourseUnlocked
            ) {
                setLimitModalVisible(true);
                setGeneratingTopic(false);
                setUserInput('');
                setTopics([]);
                setSelectedTopic([]);
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error('Error checking course count:', error);
            Alert.alert('Error', 'Failed to verify daily course limit.');
            setGeneratingTopic(false);
            return;
        }

        let topicIdea = [];
        try {
            const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY_SECOND;
            if (!apiKey) {
                setErrorModal({
                    visible: true,
                    title: 'Missing Key',
                    message: 'Your AI key is missing.',
                });
                setGeneratingTopic(false);
                return;
            }
            setGeneratingTopic(true);
            const promptText = userInput + Prompt.IDEA;
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: promptText }],
                },
            ];
            const aiResponse = await generateTopics(contents);
            const cleanedResponse =
                aiResponse && typeof aiResponse === 'string'
                    ? aiResponse.replace(/^```json[\r\n]+|```$/gi, '').trim()
                    : aiResponse;
            if (!cleanedResponse || cleanedResponse.trim() === '') {
                setErrorModal({
                    visible: true,
                    title: 'No Response',
                    message: 'The AI didn’t return any results.',
                });
                topicIdea = [];
                setGeneratingTopic(false);
                return;
            } else {
                function safeJsonParse(json: string) {
                    try {
                        return JSON.parse(json);
                    } catch {
                        return null;
                    }
                }

                try {
                    topicIdea = safeJsonParse(cleanedResponse) || [];
                } catch (e) {
                    topicIdea = [];
                    handleAiError({
                        error: e instanceof Error ? e.message : String(e),
                        supportEmail: support,
                    });
                }
            }
            setUserInput('');
        } catch (error) {
            console.error('Error generating topic:', error);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: `Failed to generate topic. \n ${error}`,
            });
            topicIdea = [];
        } finally {
            setTopics(Array.isArray(topicIdea) ? topicIdea : []);
            setGeneratingTopic(false);
        }
    };

    const onTopicSelect = (topic: string) => {
        const isAlreadyExist = selectedTopic.find((item) => item === topic);
        if (!isAlreadyExist) {
            setSelectedTopic((prev) => [...prev, topic]);
        } else {
            const topics = selectedTopic.filter((item) => item !== topic);
            setSelectedTopic(topics);
        }
    };

    const isTopicSelected = (topic: string) => {
        const selection = selectedTopic.find((item) => item === topic);
        return selection ? true : false;
    };

    const onGenerateCourse = async () => {
        if (loading) return; // Prevent double submission
        if (!selectedTopic.length) {
            setErrorModal({
                visible: true,
                title: 'No Topics Selected',
                message: 'Please select at least one topic.',
            });

            return;
        }
        setLoading(true);
        const promptText = selectedTopic + Prompt.COURSE;
        const contents = [
            {
                role: 'user',
                parts: [{ text: promptText }],
            },
        ];
        try {
            const aiResp = await generateCourse(contents);
            if (!aiResp || aiResp.trim() === '') {
                setErrorModal({
                    visible: true,
                    title: 'No Response',
                    message: 'The AI didn’t return any results.',
                });
                setLoading(false);
                return;
            }
            let coursesObj;
            try {
                coursesObj = JSON.parse(aiResp);
            } catch (e) {
                handleAiError({
                    error: e instanceof Error ? e.message : String(e),
                    supportEmail: support,
                });
                if (typeof Sentry !== 'undefined') {
                    Sentry.captureException(e, {
                        extra: { aiResponse: aiResp },
                    });
                }
                return;
            }
            // Handle both array and object with courses property
            const coursesArray = Array.isArray(coursesObj)
                ? coursesObj
                : coursesObj.courses;

            if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
                setErrorModal({
                    title: 'No Response',
                    visible: true,
                    message: 'The AI didn’t return any results.',
                });
                setLoading(false);
                return;
            }

            // Await all course writes before continuing
            await Promise.all(
                coursesArray.map(async (course) => {
                    const emailSafe = userDetail?.email.replace(/[@.]/g, '_');
                    const docId = emailSafe + '_' + Date.now().toString();

                    await setDoc(doc(db, 'course', docId), {
                        ...course,
                        createdOn: new Date(),
                        createdBy: userDetail?.email,
                        docId: docId,
                    });
                }),
            );

            safeReplace('/(tabs)/home');
            showToast('Course created successfully!');
        } catch (e: unknown) {
            console.error('Failed to generate course:', e);
            setErrorModal({
                visible: true,
                title: 'Error',
                message: 'Failed to generate course.',
            });
        } finally {
            setLoading(false);
        }
    };

    const watchRewardedAd = () => {
        showToast('Your ad is loading. It will be ready shortly.');
        rewardedAd.load();

        const unsubscribe = rewardedAd.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                rewardedAd.show();
            },
        );

        rewardedAd.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                setExtraCourseUnlocked(true);
                showToast('You earned 1 extra course!');
            },
        );

        rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
            console.error('Ad failed to load:', error);
            Alert.alert(
                'Ad Error',
                'Failed to load rewarded ad. Try again later.',
            );
        });

        // Remove listeners when done
        return () => {
            unsubscribe();
        };
    };

    return {
        generateTopic,
        onTopicSelect,
        isTopicSelected,
        onGenerateCourse,
        watchRewardedAd,
    };
};
