import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { styles } from '@/styles/SparkDetail';
import { Spark } from '@/types/sparks';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    spark: Spark;
}

export default function SparkHeader({ spark }: Props) {
    const { userDetail } = useContext(UserDetailContext);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const checkVerified = async () => {
            if (!spark.createdBy?.email) return;

            try {
                const userDoc = await getDoc(
                    doc(db, 'users', spark.createdBy.email),
                );
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsVerified(!!userData?.isVerified);
                }
            } catch (err) {
                console.log('Error checking verified status:', err);
            }
        };

        checkVerified();
    }, [spark.createdBy]);

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
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        <Text style={styles.author}>
                            {spark.createdBy.fullname}
                        </Text>
                        {isVerified && (
                            <Ionicons
                                name="checkmark-circle"
                                size={13}
                                color={Colors.PRIMARY}
                            />
                        )}
                    </View>
                    <Text style={styles.timestamp}>
                        {spark.createdAt?.toDate
                            ? dayjs(spark.createdAt.toDate()).fromNow()
                            : 'Just now'}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.categoryBox}>
                    <Text style={styles.category}>{spark.category}</Text>
                </View>
                {spark.createdBy.email === userDetail.email && (
                    <TouchableOpacity>
                        <MaterialIcons
                            name="more-vert"
                            color={'white'}
                            size={18}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
