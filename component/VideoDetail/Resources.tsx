import { VideoResource } from '@/types/video';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/Resources.styles';
import { Video } from '../../types/video';

type Props = {
    video?: Video | null;
};

export default function Resources({ video }: Props) {
    const resources = video?.resources || [];

    const handleDownload = (url: string) => {
        Linking.openURL(url).catch(() => {
            alert('Failed to open resource.');
        });
    };

    if (!resources.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Resources</Text>
                <Text style={styles.noResources}>
                    No resources available for this video.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resources</Text>
            <FlatList
                data={resources}
                keyExtractor={(item: VideoResource, index) =>
                    `${item.url}-${index}`
                }
                renderItem={({ item }) => (
                    <View style={styles.resourceItem}>
                        <Text style={styles.resourceName}>{item.name}</Text>
                        <TouchableOpacity
                            onPress={() => handleDownload(item.url)}
                        >
                            <AntDesign
                                name="download"
                                size={24}
                                color="#007BFF"
                            />
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}
