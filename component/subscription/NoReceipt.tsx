import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/Subscription.success.styles';
import { Ionicons } from '@expo/vector-icons';
import { Href } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import Button from '../Shared/Button';

const NoReceipt = ({
    safePush,
    loader,
}: {
    safePush: (path: Href) => void;
    loader: boolean;
}) => {
    return (
        <SafeAreaView style={styles.center}>
            <Text
                style={{
                    color: 'red',
                    fontFamily: 'outfit-bold',
                    fontSize: RFValue(20),
                }}
            >
                Payment verification failed.
            </Text>
            <Text
                style={{
                    color: '#fff',
                    marginBottom: moderateScale(30),
                    fontFamily: 'outfit',
                    fontSize: RFValue(18),
                }}
            >
                Please try again later.
            </Text>

            {loader ? (
                <ActivityIndicator size={'small'} color={Colors.PRIMARY} />
            ) : (
                <Button
                    onPress={() => safePush('/subscription')}
                    text={'Try again'}
                    loading={loader}
                    disabled={loader}
                    icon={
                        <Ionicons
                            name="refresh"
                            color={'white'}
                            size={scale(18)}
                        />
                    }
                />
            )}

            <Button
                onPress={() => safePush('/')}
                text={'Home'}
                loading={loader}
                disabled={loader}
                icon={null}
            />
        </SafeAreaView>
    );
};

export default NoReceipt;
