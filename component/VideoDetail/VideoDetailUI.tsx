import { Colors } from '@/constant/Colors';
import { formatDuration } from '@/helpers/formatDateVideoCard';
import { formatYouTubeDuration } from '@/services/videoService';
import { styles } from '@/styles/VideoDetail.styles';
import { VideoDetailUIProps } from '@/types/videoDetail';
import { formatViews } from '@/utils/formatViews';
import {
    AntDesign,
    Feather,
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Video as VideoView } from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import AppModal from '../Shared/AppModal';
import Button from '../Shared/Button';

const VideoDetailUI = ({
    backgroundColor,
    safeBack,
    textColor,
    video,
    adding,
    handleFavorite,
    favorite,
    handleDownload,
    downloading,
    setShowOptions,
    enrolled,
    uploaderName,
    uploadedAtText,
    handleEnroll,
    enrolling,
    handleReport,
    reporting,
    reportReason,
    setShowReportModal,
    activeTab,
    setActiveTab,
    renderTabContent,
    handleDeleteVideo,
    showDeleteModal,
    setShowDeleteModal,
    userDetail,
    showOptions,
    showReportModal,
    setReportReason,
}:VideoDetailUIProps) => {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: verticalScale(10),
                }}
            >
                <TouchableOpacity style={styles.backButton} onPress={safeBack}>
                    <AntDesign name="left" size={scale(20)} color={textColor} />
                    <Text style={[styles.backText, { color: textColor }]}>
                        Back
                    </Text>
                </TouchableOpacity>

                <View style={styles.backButton}>
                    {video.uploadedBy !== 'YouTube' && (
                        <>
                            <TouchableOpacity
                                disabled={adding}
                                onPress={handleFavorite}
                            >
                                {adding ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <AntDesign
                                        name={favorite ? 'heart' : 'hearto'}
                                        size={scale(22)}
                                        color={
                                            favorite ? Colors.RED : textColor
                                        }
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDownload}
                                disabled={downloading}
                            >
                                {downloading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Feather
                                        name="download-cloud"
                                        size={scale(22)}
                                        color={textColor}
                                    />
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => setShowOptions((prev) => !prev)}
                    >
                        <MaterialIcons
                            name="more-vert"
                            size={scale(22)}
                            color={textColor}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {(() => {
                const isYouTube = video.uploadedBy === 'YouTube';
                let videoId: string | null = null;

                if (isYouTube) {
                    videoId = video.id; // ✅ Use the ID directly

                    return (
                        <YoutubePlayer
                            height={verticalScale(230)}
                            play={true}
                            videoId={videoId}
                        />
                    );
                }

                if (enrolled) {
                    return (
                        <VideoView
                            source={{ uri: video.videoURL }}
                            style={styles.video}
                            controls
                            resizeMode="contain"
                        />
                    );
                }

                return (
                    <Image
                        source={{ uri: video.thumbnailURL }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                );
            })()}

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: textColor }]}>
                    {video.title}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(3),
                    }}
                >
                    <Text style={[styles.uploadedBy, { color: textColor }]}>
                        by{' '}
                        <Text style={{ fontFamily: 'outfit-bold' }}>
                            {uploaderName || video.uploadedBy}
                        </Text>
                    </Text>
                    {video.uploadedBy === 'YouTube' ? (
                        <AntDesign
                            name="youtube"
                            size={scale(14)}
                            color={'red'}
                        />
                    ) : (
                        <Ionicons
                            name="checkmark-circle"
                            color={Colors.PRIMARY}
                            size={scale(14)}
                        />
                    )}
                </View>

                <View style={styles.durationContainer}>
                    <View style={[styles.durationInfo, { left: scale(5) }]}>
                        {video?.uploadedBy !== 'YouTube' && (
                            <>
                                <FontAwesome
                                    name="calendar"
                                    size={scale(12)}
                                    color={textColor}
                                />
                                <Text
                                    style={[
                                        styles.uploadedAt,
                                        { color: textColor },
                                    ]}
                                >
                                    {uploadedAtText}
                                </Text>
                            </>
                        )}
                    </View>
                    <View style={[styles.durationInfo, { left: scale(40) }]}>
                        <AntDesign
                            name="clockcircleo"
                            size={scale(12)}
                            color={textColor}
                        />
                        <Text style={[styles.duration, { color: textColor }]}>
                            {typeof video.duration === 'string'
                                ? formatYouTubeDuration(video.duration)
                                : formatDuration(video.duration)}{' '}
                        </Text>
                    </View>
                    <View
                        style={[styles.durationInfo, { maxWidth: scale(100) }]}
                    >
                        <FontAwesome5
                            name="users"
                            size={scale(12)}
                            color={textColor}
                        />
                        <Text
                            numberOfLines={1}
                            style={[styles.duration, { color: textColor }]}
                        >
                            {formatViews(video.views)}
                        </Text>
                    </View>
                </View>
                <View style={styles.common}>
                    <View style={styles.box}>
                        <Text style={styles.level}>Level</Text>
                        <Text style={styles.commonText}>
                            {video?.level
                                ? video.level.charAt(0).toUpperCase() +
                                  video.level.slice(1)
                                : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.level}>Language</Text>
                        <Text style={styles.commonText}>English</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.section}>
                    {[
                        'Overview',
                        // "Resources",
                        'Reviews',
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.tabButtonActive,
                            ]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text
                                style={[
                                    styles.options,
                                    activeTab === tab && {
                                        color: Colors.GREEN,
                                    },
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View
                    style={{
                        marginHorizontal: moderateScale(12),
                        marginTop: verticalScale(10),
                    }}
                >
                    {renderTabContent()}
                </View>
            </ScrollView>
            {!enrolled && video.uploadedBy !== 'YouTube' && (
                <View style={styles.enrollContainer}>
                    <Button
                        text={enrolled ? 'Enrolled' : 'Enroll Now'}
                        onPress={handleEnroll}
                        type="fill"
                        loading={enrolling}
                        disabled={enrolling || enrolled}
                        icon={
                            <AntDesign
                                name="playcircleo"
                                size={scale(18)}
                                color={Colors.WHITE}
                            />
                        }
                    />
                </View>
            )}

            {showOptions && (
                <View
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 10,
                        backgroundColor: Colors.WHITE,
                        borderRadius: 8,
                        padding: 10,
                        elevation: 5, // Android shadow
                        shadowColor: '#000', // iOS shadow
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    {userDetail?.roles.includes('admin') && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowOptions(false);
                                setShowDeleteModal({
                                    visible: true,
                                    title: 'Delete Video',
                                    message:
                                        'Are you sure you want to delete this video?',
                                });
                            }}
                            style={{
                                borderBottomWidth: 0.5,
                                borderColor: Colors.GRAY,
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    padding: scale(5),
                                    color: 'red',
                                }}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            setShowOptions(false);
                            setShowReportModal(true);
                        }}
                    >
                        <Text style={{ padding: scale(5) }}>Report</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showReportModal} transparent animationType="slide">
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }}
                >
                    <View
                        style={{
                            width: '80%',
                            backgroundColor: textColor,
                            borderRadius: scale(8),
                            padding: scale(15),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginBottom: verticalScale(10),
                                color: backgroundColor,
                            }}
                        >
                            Report Video
                        </Text>
                        <Text
                            style={{
                                marginBottom: verticalScale(20),
                                color: backgroundColor,
                            }}
                        >
                            Please provide a reason for reporting this video.
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: Colors.GRAY,
                                borderRadius: scale(4),
                                padding: scale(10),
                                marginBottom: verticalScale(10),
                                color: backgroundColor,
                            }}
                            placeholder="Reason..."
                            value={reportReason}
                            onChangeText={setReportReason}
                            placeholderTextColor={Colors.GRAY}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: scale(12),
                                justifyContent: 'flex-end',
                            }}
                        >
                            <TouchableOpacity
                                disabled={reporting}
                                onPress={() => setShowReportModal(false)}
                            >
                                <Text
                                    style={{
                                        color: Colors.GRAY,
                                        opacity: reporting ? 0.5 : 1,
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.LIGHT_RED,
                                    padding: scale(6),
                                    borderRadius: scale(8),
                                }}
                                disabled={reporting}
                                onPress={handleReport}
                            >
                                {reporting ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Text
                                        style={{
                                            color: Colors.RED,
                                            opacity: reporting ? 0.5 : 1,
                                        }}
                                    >
                                        Report
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <AppModal
                visible={showDeleteModal.visible}
                title={showDeleteModal.title}
                message={showDeleteModal.message}
                onCancel={() =>
                    setShowDeleteModal({ ...showDeleteModal, visible: false })
                }
                onConfirm={() => {
                    setShowDeleteModal({ ...showDeleteModal, visible: false });
                    handleDeleteVideo();
                }}
            />
        </SafeAreaView>
    );
};

export default VideoDetailUI;
