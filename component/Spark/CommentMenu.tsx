import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption,
} from 'react-native-popup-menu';

interface Props {
    setModalVisible: (visible: boolean) => void;
    onDelete: () => void;
}

export default function CommentMenu({ setModalVisible, onDelete }: Props) {
    return (
        <Menu>
            <MenuTrigger style={styles.menuTrigger}>
                <Ionicons
                    name="ellipsis-vertical"
                    size={16}
                    color={Colors.GRAY}
                />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.optionsContainerStyle}>
                <MenuOption onSelect={() => setModalVisible(true)}>
                    <View style={styles.menuOption1}>
                        <Ionicons
                            name="pencil"
                            size={15}
                            color={Colors.WHITE}
                        />
                        <Text style={{ color: Colors.WHITE, fontSize: 15 }}>
                            Edit
                        </Text>
                    </View>
                </MenuOption>
                <MenuOption onSelect={onDelete}>
                    <View style={styles.menuOption2}>
                        <Ionicons
                            name="trash-bin"
                            size={15}
                            color={Colors.RED}
                        />
                        <Text style={{ color: Colors.RED, fontSize: 15 }}>
                            Delete
                        </Text>
                    </View>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
}
