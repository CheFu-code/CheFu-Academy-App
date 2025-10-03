import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant/Colors';

// Extract correct icon prop type
type TabBarIconProps = NonNullable<
    BottomTabNavigationOptions['tabBarIcon']
> extends (props: infer P) => any
    ? P
    : never;

const TabLayout = () => {
    const insets = useSafeAreaInsets();

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

    // const renderChatIcon = useCallback(
    //     ({ color, size }: TabBarIconProps) => (
    //         <Ionicons
    //             style={{ marginTop: 25, height: '100%' }}
    //             name="chatbubble-ellipses-outline"
    //             size={size}
    //             color={color}
    //         />
    //     ),
    //     [],
    // );

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
                    backgroundColor: '#121212',
                    marginHorizontal: 10,
                    elevation: 5,
                    shadowColor: '#121212',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    borderTopWidth: 0,
                },
            }}
        >
            <Tabs.Screen name="home" options={{ tabBarIcon: renderHomeIcon }} />
            <Tabs.Screen
                name="explore"
                options={{ tabBarIcon: renderExploreIcon }}
            />
            <Tabs.Screen
                name="progress"
                options={{ tabBarIcon: renderProgressIcon }}
            />
            {/* <Tabs.Screen
                name="chats"
                options={{ tabBarIcon: renderChatIcon }}
            /> */}
            <Tabs.Screen
                name="profile"
                options={{ tabBarIcon: renderProfileIcon }}
            />
        </Tabs>
    );
};

export default TabLayout;
