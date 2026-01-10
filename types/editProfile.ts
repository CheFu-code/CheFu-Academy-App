import { Href } from 'expo-router';

export interface EditProfileProps {
    backgroundColor: string;
    color: string;
    safeBack: () => void;
    profilePicture: string;
    fullname: string;
    setFullname: (value: string) => void;
    bio: string;
    setBio: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    loading: boolean;
    handleSave: () => void;
    pickImage: () => void;
    safePush: (path: Href) => void;
}
