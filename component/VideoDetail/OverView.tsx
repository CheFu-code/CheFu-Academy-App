import { useRenderTextWithLinks } from '@/helpers/detectLinks';
import useDarkMode from '@/hooks/useDarkMode';
import { Video } from '@/types/video';
import { Image, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { verticalScale } from 'react-native-size-matters';
import { styles } from '../../styles/OverView.styles';

type Props = {
    video: Video | null;
};

export default function OverView({ video }: Props) {
    const { renderTextWithLinks } = useRenderTextWithLinks();
    const { color, backgroundColor } = useDarkMode();

    return (
        <View>
            {video?.uploadedBy !== 'YouTube' && (
                <Text style={[styles.header, { color }]}>
                    What you will learn
                </Text>
            )}

            {video?.uploadedBy !== 'YouTube' && (
                <View style={{ marginTop: verticalScale(2) }}>
                    {video?.topics?.map((topic, index) => (
                        <Text
                            key={index}
                            style={[styles.topic, { color }]}
                        >
                            • {topic}
                        </Text>
                    ))}
                </View>
            )}

            <Text
                style={[
                    styles.header,
                    { marginTop: verticalScale(16), color },
                ]}
            >
                Course Description
            </Text>
            <Text style={[styles.description, { color }]}>
                {video?.description
                    ? renderTextWithLinks(video.description)
                    : 'No description available.'}
            </Text>
            <Text
                style={[
                    styles.header,
                    { marginTop: verticalScale(16), color },
                ]}
            >
                Instructor
            </Text>

            <View style={styles.profilePictureContainer}>
                {video?.thumbnailURL ? (
                    <Image
                        source={{ uri: video?.thumbnailURL }}
                        style={styles.instructorImage}
                    />
                ) : (
                    <View
                        style={[
                            styles.instructorImage,
                            {
                                backgroundColor: '#ccc',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        ]}
                    >
                        <Text>?</Text>
                    </View>
                )}
                <View>
                    <Text style={[styles.instructorName, { color }]}>
                        {video?.instructorCompany || 'Unknown'}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(14),
                            color,
                        }}
                    >
                        {video?.instructorName || 'Unknown'}
                    </Text>
                </View>
            </View>
        </View>
    );
}
