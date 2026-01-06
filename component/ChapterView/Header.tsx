import { HeaderProps } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { Dimensions, Pressable, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { moderateScale, scale } from 'react-native-size-matters';
import { styles } from '../../styles/ChapterView.styles';

const Header = ({
    loader,
    safeBack,
    color,
    getProgress,
    currentPage,
}: HeaderProps) => {
    return (
        <View style={styles.backButtonContainer}>
            <Pressable disabled={loader} onPress={safeBack}>
                <AntDesign name="left" size={scale(22)} color={color} />
            </Pressable>
            <Progress.Bar
                style={{
                    marginTop: moderateScale(20),
                }}
                progress={getProgress(currentPage)}
                width={Dimensions.get('screen').width * 0.7}
            />
        </View>
    );
};

export default Header;
