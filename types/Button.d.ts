import type { ReactNode } from 'react';

export type ButtonProps = {
    text: string;
    type?: 'fill' | 'outline';
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    accessibilityLabel?: string;
};
