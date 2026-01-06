import HeaderText from '@/component/common/Header';
import { OFFLINE_DOWNLOADS } from '@/constant/caches';
import {
    isAndroidExternalMedia,
    pathFromUri,
    toFileUri,
} from '@/helpers/fileHelpers';
import useDarkMode from '@/hooks/useDarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppModal from '../../component/Shared/AppModal';
import { Colors } from '../../constant/Colors';
import { styles } from '../../styles/Download.styles';

type DownloadItem = {
    id: string;
    title: string;
    description: string;
    uri: string;
};

export default function DownloadScreen() {
    const { backgroundColor } = useDarkMode();
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<DownloadItem | null>(null);
    const [shareModal, setShareModal] = useState({
        visible: false,
        title: '',
        message: '',
    });
    const [deleteModal, setDeleteModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    useEffect(() => {
        loadDownloads();
    }, []);

    const loadDownloads = async () => {
        const saved = await AsyncStorage.getItem(OFFLINE_DOWNLOADS);
        if (saved) setDownloads(JSON.parse(saved));
    };

    const removeDownload = async (item: DownloadItem) => {
        if (loadingId) return;
        setLoadingId(item.id);
        try {
            const uri = item.uri || '';
            const fileUri = toFileUri(uri);

            if (isAndroidExternalMedia(uri)) {
                // Public media path: use RNFS
                const absPath = pathFromUri(fileUri);
                const exists = await RNFS.exists(absPath);
                if (!exists) {
                    // Still remove the entry if file is already gone
                    const updated = downloads.filter((d) => d.id !== item.id);
                    setDownloads(updated);
                    await AsyncStorage.setItem(
                        OFFLINE_DOWNLOADS,
                        JSON.stringify(updated),
                    );
                    return;
                }
                await RNFS.unlink(absPath);
            } else {
                // App sandbox (iOS or internal): use expo-file-system
                const info = await FileSystem.getInfoAsync(fileUri);
                if (info.exists) {
                    await FileSystem.deleteAsync(fileUri, { idempotent: true });
                }
            }

            const updated = downloads.filter((d) => d.id !== item.id);
            setDownloads(updated);
            await AsyncStorage.setItem(
                OFFLINE_DOWNLOADS,
                JSON.stringify(updated),
            );
        } catch (error) {
            setDeleteModal({
                visible: true,
                title: 'Error',
                message: 'Unable to delete the course file.',
            });
            console.error('Delete error:', error);
        } finally {
            setLoadingId(null);
        }
    };

    const share = async (item: DownloadItem) => {
        if (loadingId) return;
        setLoadingId(item.id);
        try {
            const uri = item.uri || '';
            const fileUri = toFileUri(uri);

            // Verify existence depending on storage location
            let exists = false;
            if (isAndroidExternalMedia(uri)) {
                exists = await RNFS.exists(pathFromUri(fileUri));
            } else {
                const info = await FileSystem.getInfoAsync(fileUri);
                exists = !!info.exists;
            }

            if (!exists) {
                setShareModal({
                    visible: true,
                    title: 'File Not Found',
                    message: 'The file has been moved or deleted.',
                });
                return;
            }

            const available = await Sharing.isAvailableAsync();
            if (!available) {
                setShareModal({
                    visible: true,
                    title: 'Sharing Not Available',
                    message: 'This feature is not supported on your device.',
                });
                return;
            }

            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/pdf',
                dialogTitle: `Share ${item.title}`,
            });
        } catch (error) {
            setShareModal({
                visible: true,
                title: 'Error',
                message: 'Unable to share the course file.',
            });
            console.error('Share error:', error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="Downloaded Courses" />

            {downloads.length === 0 ? (
                <Text style={styles.empty}>No courses downloaded.</Text>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={downloads}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }: { item: DownloadItem }) => (
                        <View style={styles.itemBox}>
                            <View
                                style={[
                                    styles.itemBox,
                                    {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 2,
                                        borderBottomColor: Colors.PRIMARY,
                                        borderTopWidth: 2,
                                        borderTopColor: Colors.RED,
                                        backgroundColor: '#ccc',
                                        borderLeftWidth: 2,
                                        borderRightWidth: 2,
                                        borderRightColor: Colors.BLACK,
                                        borderLeftColor: Colors.GREEN,
                                    },
                                ]}
                            >
                                <Text numberOfLines={4} style={styles.itemText}>
                                    {item.title}
                                </Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <TouchableOpacity
                                        onPress={() => share(item)}
                                        disabled={!!loadingId}
                                    >
                                        {loadingId === item.id ? (
                                            <ActivityIndicator
                                                size={'small'}
                                                color={Colors.GREEN}
                                            />
                                        ) : (
                                            <Text
                                                style={[
                                                    styles.delete,
                                                    {
                                                        color: Colors.GREEN,
                                                        backgroundColor:
                                                            Colors.BG_GRAY,
                                                        borderWidth: 0.5,
                                                        borderColor:
                                                            Colors.GREEN,
                                                    },
                                                ]}
                                            >
                                                Share
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        disabled={!!loadingId}
                                        onPress={() => {
                                            setItemToDelete(item);
                                            setDeleteModal({
                                                visible: true,
                                                title: 'Delete?',
                                                message:
                                                    'Are you sure you want to delete this course file?',
                                            });
                                        }}
                                    >
                                        <Text style={styles.delete}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.desc}>{item.description}</Text>
                        </View>
                    )}
                />
            )}

            <AppModal
                visible={shareModal.visible}
                title={shareModal.title}
                message={shareModal.message}
                confirmText="OK"
                showCancel={false}
                cancelText="Cancel"
                onCancel={() =>
                    setShareModal({ ...shareModal, visible: false })
                }
                onConfirm={() =>
                    setShareModal({ ...shareModal, visible: false })
                }
            />
            <AppModal
                visible={deleteModal.visible}
                title={deleteModal.title}
                message={deleteModal.message}
                confirmText="Delete"
                showCancel={true}
                cancelText="Cancel"
                onCancel={() =>
                    setDeleteModal({ ...deleteModal, visible: false })
                }
                onConfirm={async () => {
                    setDeleteModal({ ...deleteModal, visible: false });
                    if (itemToDelete) {
                        await removeDownload(itemToDelete);
                        setItemToDelete(null);
                    }
                }}
            />
        </SafeAreaView>
    );
}
