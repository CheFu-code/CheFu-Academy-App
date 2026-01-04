import useDarkMode from '@/hooks/useDarkMode';
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant/Colors';

type TabBarIconProps = NonNullable<
    BottomTabNavigationOptions['tabBarIcon']
> extends (props: infer P) => any
    ? P
    : never;

const TabLayout = () => {
    const insets = useSafeAreaInsets();
    const { backgroundColor } = useDarkMode();
    const renderHomeIcon = useCallback(
        ({ color, size }: TabBarIconProps) => (
            <Ionicons
                style={{ marginTop: 25, height: '100%' }}
                name="home-outline"
                size={size}
                color={color}
            />
        ),
        [],
    );

    const renderExploreIcon = useCallback(
        ({ color, size }: TabBarIconProps) => (
            <MaterialCommunityIcons
                style={{ marginTop: 25, height: '100%' }}
                name="book-search"
                size={size}
                color={color}
            />
        ),
        [],
    );

    const renderSparkIcon = useCallback(
        ({ size, color }: TabBarIconProps) => (
            <MaterialIcons
                style={{
                    marginTop: 25,
                    height: '100%',
                }}
                name="compost"
                size={size}
                color={color}
            />
        ),
        [],
    );

    const renderProgressIcon = useCallback(
        ({ size, color }: TabBarIconProps) => (
            <Ionicons
                style={{
                    marginTop: 25,
                    height: '100%',
                }}
                name="bar-chart-outline"
                size={size}
                color={color}
            />
        ),
        [],
    );

    const renderProfileIcon = useCallback(
        ({ color, size }: TabBarIconProps) => (
            <Ionicons
                style={{ marginTop: 25, height: '100%' }}
                name="person-outline"
                size={size}
                color={color}
            />
        ),
        [],
    );

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
                    borderTopColor: Colors.YELLOW
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
