import { styles } from '@/styles/SparkDetail';
import { Spark } from '@/types/sparks';
import dayjs from 'dayjs';
import { Image, Text, View } from 'react-native';

interface Props {
    spark: Spark;
}

export default function SparkHeader({ spark }: Props) {
    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={
                        spark.createdBy?.profilePicture
                            ? { uri: spark.createdBy.profilePicture }
                            : require('@/assets/images/avatar.jpg')
                    }
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.author}>
                        {spark.createdBy.fullname}
                    </Text>
                    <Text style={styles.timestamp}>
                        {spark.createdAt?.toDate
                            ? dayjs(spark.createdAt.toDate()).fromNow()
                            : 'Just now'}
                    </Text>
                </View>
            </View>
            <View style={styles.categoryBox}>
                <Text style={styles.category}>{spark.category}</Text>
            </View>
        </View>
    );
}
