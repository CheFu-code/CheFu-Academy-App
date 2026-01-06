import { Ionicons } from '@expo/vector-icons';

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
