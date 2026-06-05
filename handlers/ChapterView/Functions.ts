import { interstitial } from '@/config/AdConfig';
import { db } from '@/config/firebaseConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Chapters } from '@/types/chapters';
import { showToast } from '@/utils/toast';
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AdEventType } from 'react-native-google-mobile-ads';

export const useChapterViewHook = () => {
    const { safeReplace } = useSafeNavigation();
    const { docId, chapterIndex } = useLocalSearchParams();
    const [loader, setLoader] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copying, setCopying] = useState(false);
    let chapters: Chapters = { content: [] };

    
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
            showToast('Chapter completed!');
            showToast("You'll be redirected to the course overview.");

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
            showToast('Error completing chapter!');
            console.error(error);
            setLoader(false);
        }
    };

    const handleCopy = async (text: string) => {
        if (copying) return;
        setCopying(true);
        try {
            await Clipboard.setStringAsync(text);
            setCopied(true);
            showToast('Code copied to clipboard!');
            setTimeout(() => setCopied(false), 1200);
        } catch (error) {
            console.error(error);
            showToast('Error copying code!');
        } finally {
            setCopying(false);
        }
    };

    return { getProgress, onChapterComplete, handleCopy };
};
