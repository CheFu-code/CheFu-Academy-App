import { Text } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const ListEmpty = () => {
    return (
        <Text
            style={{
                textAlign: 'center',
                marginTop: verticalScale(20),
                color: '#999',
            }}
        >
            No courses found.
        </Text>
    );
};

export default ListEmpty;
