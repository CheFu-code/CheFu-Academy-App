import { UserDetail } from "../UserDetail";

export type UserDetailContextType = {
    userDetail: UserDetail | null;
    setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
};
