import { Colors } from '@/constant/Colors';
import { PropsP } from '@/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import Button from '../Shared/Button';

const Next_Finish_Button = ({
    chapters,
    currentPage,
    loader,
    setCurrentPage,
    onChapterComplete,
}: PropsP) => {
    return (
        <View style={{ marginBottom: moderateScale(35) }}>
            {chapters?.content?.length - 1 !== currentPage ? (
                <Button
                    loading={loader}
                    onPress={() => setCurrentPage(currentPage + 1)}
                    text={'Next'}
                    disabled={null}
                    icon={
                        <Ionicons
                            name="chevron-forward"
                            size={scale(20)}
                            color={Colors.WHITE}
                        />
                    }
                />
            ) : (
                <Button
                    onPress={() => onChapterComplete()}
                    loading={loader}
                    text={'Finish'}
                    disabled={loader}
                    icon={
                        <MaterialIcons
                            name="check"
                            size={scale(20)}
                            color={Colors.WHITE}
                        />
                    }
                />
            )}
        </View>
    );
};

export default Next_Finish_Button;
