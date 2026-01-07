import { Alert } from 'react-native';

export const handleAiError = ({
    error,
    supportEmail,
}: {
    error: string;
    supportEmail: string;
}) => {
    Alert.alert(
        'Error',
        `Our AI did not respond with supported data.\nPlease try again later. If the issue persists, contact support: \n${supportEmail}`,
    );
};
