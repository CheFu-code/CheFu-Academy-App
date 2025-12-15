export interface EditProfileProps {
    backgroundColor: string;
    textColor: string;
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
}