import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/Permissions.styles';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';

type PermissionKeys = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

interface PermissionsUIProps {
    permissions: Record<PermissionKeys, boolean>;
    requestPermission: (type: PermissionKeys) => Promise<void>;
    openSettings: () => void;
    permissionDisplayNames: Record<PermissionKeys, string>;
}

const PermissionsUI = ({
    permissions,
    requestPermission,
    openSettings,
    permissionDisplayNames,
}: PermissionsUIProps) => {
    const { safeBack } = useSafeNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={safeBack}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scale(10),
                }}
            >
                <AntDesign size={scale(20)} name="left" color={'white'} />
                <Text style={styles.title}>App Permissions</Text>
            </TouchableOpacity>

            {Object.entries(permissions).map(([key, granted]) => (
                <View key={key} style={styles.item}>
                    <Text style={styles.label}>
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
                        <Text style={styles.buttonText}>
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
