import { Colors } from '@/constant/Colors';
import { ScrollViewProp } from '@/types';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { styles } from '../../styles/ChapterView.styles';

const ScrollViewComp = ({
    chapters,
    currentPage,
    maxLines,
    textColor,
    setShowFull,
    showFull,
    copying,
    handleCopy,
    copied,
}: ScrollViewProp) => {
    return (
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
                                .map((subPart: string, subIndex: number) => {
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
                                });
                        }

                        // If it's inline code
                        return (
                            <Text key={index} selectable style={styles.content}>
                                {content}
                            </Text>
                        );
                    })}

                {chapters?.content?.[currentPage]?.explain &&
                    chapters?.content?.[currentPage]?.explain?.length > 200 && (
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
                        <View style={[styles.windowCircle, styles.circleRed]} />
                        <View
                            style={[styles.windowCircle, styles.circleYellow]}
                        />
                        <View
                            style={[styles.windowCircle, styles.circleGreen]}
                        />
                    </View>

                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Code:</Text>
                        <TouchableOpacity
                            disabled={copying}
                            onPress={() =>
                                handleCopy(
                                    chapters?.content?.[currentPage]?.code ??
                                        '<No code provided>',
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
                            const content = isCode ? part.slice(1, -1) : part;

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
    );
};

export default ScrollViewComp;
