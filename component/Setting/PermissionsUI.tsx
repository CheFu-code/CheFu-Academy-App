import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/Permissions.styles';
import { PermissionKeys, PermissionsUIProps } from '@/types/permissions';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import HeaderText from '../common/Header';

const PermissionsUI = ({
    permissions,
    requestPermission,
    openSettings,
    permissionDisplayNames,
}: PermissionsUIProps) => {
    const { textColor, backgroundColor } = useDarkMode();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="App Permissions" />
            {Object.entries(permissions).map(([key, granted]) => (
                <View key={key} style={styles.item}>
                    <Text style={[styles.label, { color: textColor }]}>
                        {permissionDisplayNames[key as PermissionKeys]}
                    </Text>

                    <TouchableOpacity
                        onPress={() => requestPermission(key as PermissionKeys)}
                        style={[
                            styles.button,
                            granted ? styles.granted : styles.denied,
                        ]}
                    >
                        <Ionicons
                            name={granted ? 'checkmark-circle' : 'close-circle'}
                            size={scale(20)}
                            color={granted ? 'green' : 'red'}
                            style={{ marginRight: verticalScale(6) }}
                        />
                        <Text style={[styles.buttonText, { color: textColor }]}>
                            {granted ? 'Granted' : 'Request'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity
                onPress={openSettings}
                style={styles.settingsButton}
            >
                <Text style={styles.settingsText}>Open App Settings</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PermissionsUI;
