import { useTabIcons } from '@/component/Shared/TabIcons';
import useDarkMode from '@/hooks/useDarkMode';
import { Tabs } from 'expo-router';
import {
    useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Colors } from '../../constant/Colors';

const TabLayout = () => {
    const insets = useSafeAreaInsets();
    const { backgroundColor } = useDarkMode();

    const {
        renderHomeIcon,
        renderExploreIcon,
        renderSparkIcon,
        renderProgressIcon,
        renderProfileIcon,
    } = useTabIcons();

    return (
        <Tabs
            detachInactiveScreens={true}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: Colors.YELLOW,
                tabBarStyle: {
                    paddingBottom: insets.bottom,
                    backgroundColor: backgroundColor,
                    elevation: 5,
                    shadowColor: '#121212',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    borderTopWidth: 0.3,
                    borderTopColor: Colors.YELLOW,
                },
            }}
        >
            <Tabs.Screen name="home" options={{ tabBarIcon: renderHomeIcon }} />
            <Tabs.Screen
                name="explore"
                options={{ tabBarIcon: renderExploreIcon }}
            />
            <Tabs.Screen
                name="spark"
                options={{ tabBarIcon: renderSparkIcon }}
            />
            <Tabs.Screen
                name="progress"
                options={{ tabBarIcon: renderProgressIcon }}
            />

            <Tabs.Screen
                name="profile"
                options={{ tabBarIcon: renderProfileIcon }}
            />
        </Tabs>
    );
};

export default TabLayout;
