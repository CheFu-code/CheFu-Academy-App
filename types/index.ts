import { Ionicons } from '@expo/vector-icons';
import { Chapters } from './chapters';

export type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
};

export interface FirebaseAuthError {
    code?: string;
    message?: string;
}

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export type RenderInputProps = {
    label: string;
    show: {
        current: boolean;
        new: boolean;
        confirm: boolean;
    };
    setShow: React.Dispatch<
        React.SetStateAction<{
            current: boolean;
            new: boolean;
            confirm: boolean;
        }>
    >;
    field: 'current' | 'new' | 'confirm';
    value: string;
    setter: (text: string) => void;
};

export type HeaderProps = {
    loader: boolean;
    safeBack: () => void;
    color: string;
    getProgress: (currentPage: number) => number;
    currentPage: number;
};

export type ScrollViewProp = {
    chapters: Chapters;
    currentPage: number;
    maxLines: number | undefined;
    color: string;
    setShowFull: React.Dispatch<React.SetStateAction<boolean>>;
    showFull: boolean;
    copying: boolean;
    handleCopy: (text: string) => Promise<void>;
    copied: boolean;
};

export type PropsP = {
    chapters: Chapters;
    currentPage: number;
    loader: boolean;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    onChapterComplete: () => Promise<void>;
};
