import { db } from '@/config/firebaseConfig';
import { Spark } from '@/types/sparks';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from '@react-native-firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

export const fetchInitialSparks = async (
    SPARKS_LIMIT: number,
    setSparks: (sparks: Spark[]) => void,
    setLastVisible: (
        doc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null,
    ) => void,
    setLoading: (loading: boolean) => void,
) => {
    setLoading(true);
    try {
        const q = query(
            collection(db, 'sparks'),
            orderBy('createdAt', 'desc'),
            limit(SPARKS_LIMIT),
        );

        const snapshot = await getDocs(q);
        const fetchedSparks: Spark[] = snapshot.docs.map(
            (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...(doc.data() as Omit<Spark, 'id'>),
            }),
        );

        setSparks(fetchedSparks);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
        console.error('Error fetching sparks:', error);
    } finally {
        setLoading(false);
    }
};


export const fetchMoreSparks = async (
    SPARKS_LIMIT: number,
    lastVisible: FirebaseFirestoreTypes.QueryDocumentSnapshot | null,
    setSparks: Dispatch<SetStateAction<Spark[]>>,
    setLastVisible: (
        doc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null,
    ) => void,
    loadingMore: boolean,
    setLoadingMore: (loading: boolean) => void,
) => {
    if (!lastVisible || loadingMore) return;

    setLoadingMore(true);
    try {
        const q = query(
            collection(db, 'sparks'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(SPARKS_LIMIT),
        );

        const snapshot = await getDocs(q);
        const moreSparks: Spark[] = snapshot.docs.map(
            (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                id: doc.id,
                ...(doc.data() as Omit<Spark, 'id'>),
            }),
        );

        setSparks((prev) => [...prev, ...moreSparks]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || lastVisible);
    } catch (error) {
        console.error('Error fetching more sparks:', error);
    } finally {
        setLoadingMore(false);
    }
};
