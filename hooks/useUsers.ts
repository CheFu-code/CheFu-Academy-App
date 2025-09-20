// hooks/useUsers.ts
import { UserDetailContext } from "@/context/UserDetailContext";
import { User } from "@/types/user";
import { collection, FirebaseFirestoreTypes, getDocs, getFirestore } from "@react-native-firebase/firestore";
import { useContext, useState } from "react";

export const useUsers = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [userList, setUserList] = useState<User[]>([]);
    const db = getFirestore();

    const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, "users"));
        const users: User[] = snapshot.docs
            .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }))
            .filter((u: User) => u.id !== userDetail?.email);
        setUserList(users);
    };

    return { userList, fetchUsers };
};
