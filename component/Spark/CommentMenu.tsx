import { Colors } from '@/constant/Colors';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale } from 'react-native-size-matters';

interface Props {
    setModalVisible: (visible: boolean) => void;
    onDelete: () => void;
}

export default function CommentMenu({ setModalVisible, onDelete }: Props) {
    const { color, backgroundColor } = useDarkMode();
    return (
        <Menu>
            <MenuTrigger style={styles.menuTrigger}>
                <Ionicons
                    name="ellipsis-vertical"
                    size={scale(15)}
                    color={Colors.GRAY}
                />
            </MenuTrigger>

            <MenuOptions
                optionsContainerStyle={[
                    styles.optionsContainerStyle,
                    { backgroundColor },
                ]}
            >
                <MenuOption onSelect={() => setModalVisible(true)}>
                    <View style={styles.menuOption1}>
                        <Ionicons
                            name="pencil"
                            size={scale(15)}
                            color={color}
                        />
                        <Text
                            style={{
                                color,
                                fontSize: RFValue(14),
                                fontFamily: 'outfit-bold',
                            }}
                        >
                            Edit
                        </Text>
                    </View>
                </MenuOption>
                <MenuOption onSelect={onDelete}>
                    <View style={styles.menuOption2}>
                        <Ionicons
                            name="trash-bin"
                            size={scale(15)}
                            color={Colors.RED}
                        />
                        <Text
                            style={{
                                color: Colors.RED,
                                fontSize: RFValue(14),
                                fontFamily: 'outfit-bold',
                            }}
                        >
                            Delete
                        </Text>
                    </View>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
}
