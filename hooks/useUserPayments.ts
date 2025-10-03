import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    query,
    where,
} from '@react-native-firebase/firestore';
import { db } from '@/config/fireConfig';

interface Payment {
    id: string;
    [key: string]: any;
}

export const useUserPayments = (email?: string) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    const getUserPayments = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'payments'), where('email', '==', email));
            const snapshot = await getDocs(q);

            const data: Payment[] = snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPayments(data);
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to fetch payment history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserPayments();
    }, [email]);

    return { payments, loading, getUserPayments };
};
