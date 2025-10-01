import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparkDetail';
import { Spark } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { deleteDoc, doc, getDoc } from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    spark: Spark;
}

export default function SparkHeader({ spark }: Props) {
    const { safeReplace } = useSafeNavigation();
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

    const handleDelete = () => {
        Alert.alert(
            'Delete Spark',
            'Are you sure you want to delete this spark?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (!spark.id) return;
                            const sparkRef = doc(db, 'sparks', spark.id);
                            await deleteDoc(sparkRef);
                            safeReplace('/(tabs)/home')
                            showToast('Spark deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting spark:', error);
                            showToast('Failed to delete spark.');
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

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
                    <TouchableOpacity
                        onPress={() => handleDelete()}
                        style={styles.delete}
                    >
                        <FontAwesome name="trash-o" color={'red'} size={16} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
