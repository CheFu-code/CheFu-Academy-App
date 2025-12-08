import { Video } from '@/types/video';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from '../../styles/OverView.styles';
import { useRenderTextWithLinks } from '@/helpers/detectLinks';
import { verticalScale } from 'react-native-size-matters';
import { RFValue } from 'react-native-responsive-fontsize';
import useDarkMode from '@/hooks/useDarkMode';

type Props = {
    video: Video | null;
};

export default function OverView({ video }: Props) {
    const { renderTextWithLinks } = useRenderTextWithLinks();
    const { textColor, backgroundColor } = useDarkMode();

    return (
        <View>
            {video?.uploadedBy !== 'YouTube' && (
                <Text style={[styles.header, { color: textColor }]}>
                    What you will learn
                </Text>
            )}

            {video?.uploadedBy !== 'YouTube' && (
                <View style={{ marginTop: verticalScale(2) }}>
                    {video?.topics?.map((topic, index) => (
                        <Text
                            key={index}
                            style={[styles.topic, { color: textColor }]}
                        >
                            • {topic}
                        </Text>
                    ))}
                </View>
            )}

            <Text
                style={[
                    styles.header,
                    { marginTop: verticalScale(16), color: textColor },
                ]}
            >
                Course Description
            </Text>
            <Text style={[styles.description, { color: textColor }]}>
                {video?.description
                    ? renderTextWithLinks(video.description)
                    : 'No description available.'}
            </Text>
            <Text
                style={[
                    styles.header,
                    { marginTop: verticalScale(16), color: textColor },
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
                    <Text style={[styles.instructorName, { color: textColor }]}>
                        {video?.instructorCompany || 'Unknown'}
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(14),
                            color: textColor,
                        }}
                    >
                        {video?.instructorName || 'Unknown'}
                    </Text>
                </View>
            </View>
        </View>
    );
}
