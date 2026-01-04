import { styles } from '@/styles/SparkDetail';
import { Replies, RepliesListProps } from '@/types/sparks';
import dayjs from 'dayjs';
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    Vibration,
    View,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import NoReply from '../NoReply';

const RepliesList = ({
    comment,
    safePush,
    userDetail,
    handleDeleteReply,
    renderTextWithLinks,
}: RepliesListProps) => {
    return (
        <ScrollView
            style={{ flex: 1, marginVertical: verticalScale(10) }}
            contentContainerStyle={{
                paddingBottom: moderateScale(20),
            }}
            showsVerticalScrollIndicator={true}
        >
            {comment.replies && comment.replies.length > 0 ? (
                comment.replies.map((reply: Replies) => (
                    <View key={reply.id} style={[styles.containerReply]}>
                        <View style={styles.X}>
                            <Image
                                source={{
                                    uri: reply.createdBy.profilePicture,
                                }}
                                style={styles.commentAvatar}
                            />
                            <View style={{ flex: 1 }}>
                                <Pressable
                                    onPress={() => {
                                        safePush({
                                            pathname: '/profileView',
                                            params: {
                                                userId: reply.createdBy.email,
                                            },
                                        });
                                    }}
                                    style={styles.fullnameCont}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={styles.fullname}
                                    >
                                        {reply.createdBy.fullname}
                                    </Text>

                                    <Text style={styles.commentTimestamp}>
                                        {reply.createdAt?.toDate
                                            ? dayjs(
                                                  reply.createdAt.toDate(),
                                              ).fromNow()
                                            : 'N/A'}
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onLongPress={() => {
                                        if (
                                            reply.createdBy.email ===
                                            userDetail?.email
                                        ) {
                                            Vibration.vibrate();
                                            handleDeleteReply(reply.id);
                                        }
                                    }}
                                >
                                    <Text style={styles.reply}>
                                        {renderTextWithLinks(reply.text)}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <NoReply />
            )}
        </ScrollView>
    );
};

export default RepliesList;
