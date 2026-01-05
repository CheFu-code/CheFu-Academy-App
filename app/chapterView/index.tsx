import { db } from '@/config/fireConfig';
import { INTERSTITIAL_AD_UNIT_ID } from '@/constant/random';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import * as Progress from 'react-native-progress';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Button from '../../component/Shared/Button';
import { Colors } from '../../constant/Colors';
import { styles } from '../../styles/ChapterView.styles';

interface Chapter {
    topic: string;
    explain?: string;
    code?: string;
    example?: string;
}

interface Chapters {
    content: Chapter[];
}

export default function ChapterView() {
    const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
    const [showFull, setShowFull] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loader, setLoader] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copying, setCopying] = useState(false);
    const { safeBack, safeReplace } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const maxLines = showFull ? undefined : 5;
    let chapters: Chapters = { content: [] };

    if (
        typeof chapterParams === 'string' &&
        chapterParams.trim() !== '' &&
        chapterParams.trim() !== 'undefined' &&
        (chapterParams.trim().startsWith('{') ||
            chapterParams.trim().startsWith('['))
    ) {
        try {
            chapters = JSON.parse(chapterParams);
        } catch (e) {
            console.error('Failed to parse chapterParams:', chapterParams, e);
            chapters = { content: [] };
        }
    } else {
        console.warn('chapterParams is missing or invalid:', chapterParams);
        chapters = { content: [] };
    }

    const getProgress = (currentPage: number) => {
        const percentage = currentPage / chapters?.content?.length;
        return percentage;
    };

    const onChapterComplete = async () => {
        if (loader) return; // prevent double trigger
        setLoader(true);
        try {
            const docIdParam = Array.isArray(docId) ? docId[0] : docId;
            const courseRef = doc(db, 'course', docIdParam);
            await updateDoc(courseRef, {
                completedChapter: arrayUnion(chapterIndex),
            });
            const courseSnap = await getDoc(courseRef);
            const courseObject = courseSnap.exists()
                ? courseSnap.data()
                : { chapters: [] };
            ToastAndroid.show('Chapter completed!', ToastAndroid.SHORT);

            ToastAndroid.show(
                "You'll be redirected to the course overview.",
                ToastAndroid.SHORT,
            );

            const interstitial = InterstitialAd.createForAdRequest(
                INTERSTITIAL_AD_UNIT_ID,
                { requestNonPersonalizedAdsOnly: true },
            );

            const unsubscribe = interstitial.addAdEventsListener(({ type }) => {
                if (type === AdEventType.LOADED) {
                    interstitial.show();
                }
                if (type === AdEventType.CLOSED || type === AdEventType.ERROR) {
                    unsubscribe();
                    safeReplace({
                        pathname: '/courseView',
                        params: {
                            courseParams: JSON.stringify(courseObject),
                        },
                    });
                    setLoader(false);
                }
            });
            interstitial.load();
        } catch (error) {
            ToastAndroid.show('Error completing chapter!', ToastAndroid.SHORT);
            console.log(error);
            setLoader(false);
        }
    };

    const handleCopy = async (text: string) => {
        if (copying) return;
        setCopying(true);
        try {
            await Clipboard.setStringAsync(text);
            setCopied(true);
            ToastAndroid.show('Code copied to clipboard!', ToastAndroid.CENTER);
            setTimeout(() => setCopied(false), 1200);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Error copying code!', ToastAndroid.SHORT);
        } finally {
            setCopying(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.backButtonContainer}>
                <Pressable disabled={loader} onPress={safeBack}>
                    <AntDesign name="left" size={scale(22)} color={textColor} />
                </Pressable>
                <Progress.Bar
                    style={{
                        marginTop: moderateScale(20),
                    }}
                    progress={getProgress(currentPage)}
                    width={Dimensions.get('screen').width * 0.7}
                />
            </View>

            <ScrollView
                style={{ marginTop: moderateScale(20) }}
                contentContainerStyle={{ paddingBottom: moderateScale(40) }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.topic}>
                    {chapters?.content[currentPage]?.topic}
                </Text>

                <View style={styles.explainContainer}>
                    {chapters?.content[currentPage]?.explain
                        ?.split(/(`[^`]+`)/g)
                        .map((part: string, index: number) => {
                            const isCode =
                                part.startsWith('`') && part.endsWith('`');
                            const content = isCode ? part.slice(1, -1) : part;

                            // Step 2: If not code, further split by quotes
                            if (!isCode) {
                                return content
                                    .split(/(["'][^"']+["'])/g)
                                    .map(
                                        (subPart: string, subIndex: number) => {
                                            const isQuoted =
                                                subPart.startsWith('"') &&
                                                subPart.endsWith('"');

                                            const text = isQuoted
                                                ? subPart.slice(1, -1)
                                                : subPart;

                                            return (
                                                <Text
                                                    numberOfLines={maxLines}
                                                    key={`${index}-${subIndex}`}
                                                    selectable
                                                    style={{
                                                        fontFamily: isQuoted
                                                            ? 'outfit-bold'
                                                            : 'outfit',
                                                        fontSize: RFValue(16),
                                                        color: textColor,
                                                    }}
                                                >
                                                    {text}
                                                </Text>
                                            );
                                        },
                                    );
                            }

                            // If it's inline code
                            return (
                                <Text
                                    key={index}
                                    selectable
                                    style={styles.content}
                                >
                                    {content}
                                </Text>
                            );
                        })}

                    {chapters?.content?.[currentPage]?.explain &&
                        chapters?.content?.[currentPage]?.explain?.length >
                            200 && (
                            <TouchableOpacity
                                onPress={() => setShowFull(!showFull)}
                            >
                                <Text
                                    style={{
                                        color: showFull
                                            ? Colors.YELLOW
                                            : Colors.GREEN,
                                        marginTop: moderateScale(5),
                                    }}
                                >
                                    {showFull ? 'Read less ▲' : 'Read more ▼'}
                                </Text>
                            </TouchableOpacity>
                        )}
                </View>

                {chapters?.content[currentPage]?.code && (
                    <View style={styles.codeBlockContainer}>
                        <View style={styles.codeBlockTopBar}>
                            <View
                                style={[styles.windowCircle, styles.circleRed]}
                            />
                            <View
                                style={[
                                    styles.windowCircle,
                                    styles.circleYellow,
                                ]}
                            />
                            <View
                                style={[
                                    styles.windowCircle,
                                    styles.circleGreen,
                                ]}
                            />
                        </View>

                        <View style={styles.codeContainer}>
                            <Text style={styles.codeLabel}>Code:</Text>
                            <TouchableOpacity
                                disabled={copying}
                                onPress={() =>
                                    handleCopy(
                                        chapters?.content?.[currentPage]
                                            ?.code ?? '<No code provided>',
                                    )
                                }
                                style={styles.copyButton}
                            >
                                {copying ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#61dafb"
                                    />
                                ) : (
                                    <Text style={styles.copyButtonText}>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            style={{ maxWidth: '100%' }}
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <Text
                                selectable
                                style={styles.advancedCodeBlock}
                                numberOfLines={100} // allow wrapping if needed
                            >
                                {chapters?.content[currentPage]?.code}
                            </Text>
                        </ScrollView>
                    </View>
                )}

                {chapters?.content[currentPage]?.example && (
                    <Text style={[styles.exampleText, { color: textColor }]}>
                        Example:
                    </Text>
                )}

                {chapters?.content[currentPage]?.example && (
                    <View
                        style={{
                            ...styles.codeExampleText,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        {chapters?.content[currentPage]?.example
                            ?.split(/(`[^`]+`)/g)
                            .map((part, index) => {
                                const isCode =
                                    part.startsWith('`') && part.endsWith('`');
                                const content = isCode
                                    ? part.slice(1, -1)
                                    : part;

                                return (
                                    <Text
                                        key={index}
                                        selectable
                                        style={{
                                            fontFamily: isCode
                                                ? 'monospace'
                                                : 'outfit',
                                            fontSize: RFValue(14),
                                            color: Colors.WHITE,
                                            backgroundColor: isCode
                                                ? '#333'
                                                : 'transparent',
                                            paddingHorizontal: isCode
                                                ? moderateScale(4)
                                                : 0,
                                            paddingVertical: isCode
                                                ? verticalScale(2)
                                                : 0,
                                            borderRadius: isCode ? scale(5) : 0,
                                            marginTop: isCode
                                                ? moderateScale(1.5)
                                                : 0,
                                        }}
                                    >
                                        {content}
                                    </Text>
                                );
                            })}
                    </View>
                )}
            </ScrollView>

            <View style={{ marginBottom: moderateScale(35) }}>
                {chapters?.content?.length - 1 !== currentPage ? (
                    <Button
                        loading={loader}
                        onPress={() => setCurrentPage(currentPage + 1)}
                        text={'Next'}
                        disabled={null}
                        icon={
                            <Ionicons
                                name="chevron-forward"
                                size={scale(20)}
                                color={Colors.WHITE}
                            />
                        }
                    />
                ) : (
                    <Button
                        onPress={() => onChapterComplete()}
                        loading={loader}
                        text={'Finish'}
                        disabled={loader}
                        icon={
                            <MaterialIcons
                                name="check"
                                size={scale(20)}
                                color={Colors.WHITE}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
