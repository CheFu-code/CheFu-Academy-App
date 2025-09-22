import {
    View,
    Text,
    TextInput,
    Button as Button2,
    Image,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '@/utils/toast';
import axios from 'axios';
import { VideoCategory } from '@/data/categories';
import { Colors } from '@/constant/Colors';

export default function AddVideoModal({
    visible,
    onClose,
    onSave,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (videoData: any) => void;
}) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);

    // Dropdown state
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState<string>(
        VideoCategory[0].value,
    ); // default to first category

    const handleFetchInfo = useCallback(async () => {
        if (!url.trim()) {
            showToast('Invalid YouTube URL');
            return;
        }
        setLoading(true);

        try {
            const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            if (match) {
                const videoId = match[1];
                const API_KEY = 'AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY';
                const res = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`,
                );

                if (res.data.items && res.data.items.length > 0) {
                    const snippet = res.data.items[0].snippet;
                    const data = {
                        videoId,
                        title: snippet.title,
                        thumbnailURL: snippet.thumbnails.high.url,
                        // removed category here
                    };
                    setVideoData(data);
                    setUrl('');
                } else {
                    showToast('Video not found');
                }
            } else {
                showToast('Invalid YouTube URL');
            }
        } catch (error) {
            console.error('Fetching error: ', error);
            showToast('Failed to fetch video info');
        } finally {
            setLoading(false);
        }
    }, [url]);

    const handleSave = () => {
        if (videoData) {
            onSave({ ...videoData, category: categoryValue });
            setUrl('');
            setVideoData(null);
            onClose();
        }
    };

    useEffect(() => {
        if (!url.trim()) return;
        const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
        if (match) handleFetchInfo();
    }, [url, handleFetchInfo]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.label}>Paste YouTube URL:</Text>
                    <TextInput
                        value={url}
                        onChangeText={setUrl}
                        placeholder="https://www.youtube.com/watch?v=..."
                        style={styles.input}
                        placeholderTextColor={Colors.GRAY}
                    />

                    <Text style={styles.label}>Select Category:</Text>
                    <DropDownPicker
                        open={categoryOpen}
                        value={categoryValue}
                        items={[...VideoCategory]}
                        setOpen={setCategoryOpen}
                        setValue={setCategoryValue}
                        containerStyle={{ width: '100%', marginBottom: 12 }}
                        style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                        listMode="SCROLLVIEW"
                    />

                    {loading && (
                        <ActivityIndicator size="small" color="black" />
                    )}

                    {videoData && (
                        <View style={styles.preview}>
                            <Image
                                source={{ uri: videoData.thumbnailURL }}
                                style={styles.thumbnail}
                            />
                            <Text style={styles.title}>{videoData.title}</Text>

                            {loading ? (
                                <ActivityIndicator size="small" color="black" />
                            ) : (
                                <Button2
                                    title="Save video"
                                    onPress={handleSave}
                                    disabled={loading || !videoData}
                                />
                            )}
                        </View>
                    )}

                    {!loading && (
                        <TouchableOpacity
                            onPress={() => {
                                setUrl('');
                                setVideoData(null);
                                onClose();
                            }}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    label: { marginBottom: 8, fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        width: '100%',
        marginBottom: 12,
        borderRadius: 6,
        color: 'black',
    },
    preview: { marginTop: 20, alignItems: 'center' },
    thumbnail: { width: 200, height: 120, marginBottom: 8, borderRadius: 6 },
    title: { fontWeight: '600', marginBottom: 8, textAlign: 'center' },
    closeButton: { marginTop: 16 },
    closeText: { color: 'red', fontWeight: '600' },
});
