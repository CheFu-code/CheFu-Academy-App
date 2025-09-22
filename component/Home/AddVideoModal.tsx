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
import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast';
import Button from '../Shared/Button';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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

    const handleFetchInfo = async () => {
        if (typeof url !== 'string' || !url.trim()) {
            showToast('Invalid YouTube URL');
            return;
        }
        setLoading(true);

        try {
            const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            if (match) {
                const videoId = match[1];

                // Replace with your YouTube API key
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
    };

    useEffect(() => {
        if (typeof url !== 'string' || !url.trim()) return;
        const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
        if (match) handleFetchInfo();
    }, [url]);

    const handleSave = () => {
        setLoading(true);
        try {
            if (videoData) {
                onSave(videoData);
                setUrl('');
                setVideoData(null);
                onClose();
            }
        } catch (error) {
            console.log('error saving video:  ', error);
        } finally {
            setLoading(false);
        }
    };

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
                        placeholderTextColor={Colors.BLACK}
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
                                <ActivityIndicator
                                    size={'small'}
                                    color={'black'}
                                />
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
