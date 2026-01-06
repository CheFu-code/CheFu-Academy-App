import Header from '@/component/ChapterView/Header';
import Next_Finish_Button from '@/component/ChapterView/Next_Finish_Button';
import ScrollViewComp from '@/component/ChapterView/ScrollView';
import { useChapterViewHook } from '@/handlers/ChapterView/Functions';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Chapters } from '@/types/chapters';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { styles } from '../../styles/ChapterView.styles';

export default function ChapterView() {
    const { safeBack } = useSafeNavigation();
    const { textColor, backgroundColor } = useDarkMode();
    const { chapterParams } = useLocalSearchParams();
    const { getProgress, onChapterComplete, handleCopy } = useChapterViewHook();
    const [showFull, setShowFull] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loader] = useState(false);
    const [copied] = useState(false);
    const [copying] = useState(false);
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
        chapters = { content: [] };
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <Header
                loader={loader}
                safeBack={safeBack}
                textColor={textColor}
                getProgress={getProgress}
                currentPage={currentPage}
            />

            <ScrollViewComp
                chapters={chapters}
                currentPage={currentPage}
                maxLines={maxLines}
                textColor={textColor}
                setShowFull={setShowFull}
                showFull={showFull}
                copying={copying}
                handleCopy={handleCopy}
                copied={copied}
            />

            <Next_Finish_Button
                chapters={chapters}
                currentPage={currentPage}
                loader={loader}
                setCurrentPage={setCurrentPage}
                onChapterComplete={onChapterComplete}
            />
        </SafeAreaView>
    );
}
