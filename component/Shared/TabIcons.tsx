// /hooks/TabIcons.tsx OR /components/Shared/TabIcons.tsx
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';

export type TabBarIconProps = NonNullable<
    BottomTabNavigationOptions['tabBarIcon']
> extends (props: infer P) => any
    ? P
    : never;

export const useTabIcons = () => {
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
                style={{ marginTop: 25, height: '100%' }}
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
                style={{ marginTop: 25, height: '100%' }}
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

    return {
        renderHomeIcon,
        renderExploreIcon,
        renderSparkIcon,
        renderProgressIcon,
        renderProfileIcon,
    };
};
