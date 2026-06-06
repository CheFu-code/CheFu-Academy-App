import { chefuApiClient } from '@/services/chefuApiClient';
import { Spark } from '@/types/sparks';
import { Dispatch, SetStateAction } from 'react';

// Using a standard cursor string or page number instead of Firebase DocumentSnapshot
export const fetchInitialSparks = async (
    limit: number,
    setSparks: (sparks: Spark[]) => void,
    setLastVisible: (cursor: string | null) => void,
    setLoading: (loading: boolean) => void,
) => {
    setLoading(true);
    try {
        const response = await chefuApiClient.get('/academy-mobile/sparks', {
            params: { limit }
        });
        
        const fetchedSparks: Spark[] = response.data.data;
        setSparks(fetchedSparks);
        setLastVisible(response.data.nextCursor || null);
    } catch (error) {
        console.error('Error fetching sparks:', error);
    } finally {
        setLoading(false);
    }
};

export const fetchMoreSparks = async (
    limit: number,
    lastVisible: string | null,
    setSparks: Dispatch<SetStateAction<Spark[]>>,
    setLastVisible: (cursor: string | null) => void,
    loadingMore: boolean,
    setLoadingMore: (loading: boolean) => void,
) => {
    if (!lastVisible || loadingMore) return;

    setLoadingMore(true);
    try {
        const response = await chefuApiClient.get('/academy-mobile/sparks', {
            params: { limit, cursor: lastVisible }
        });

        const moreSparks: Spark[] = response.data.data;
        setSparks((prev) => [...prev, ...moreSparks]);
        setLastVisible(response.data.nextCursor || null);
    } catch (error) {
        console.error('Error fetching more sparks:', error);
    } finally {
        setLoadingMore(false);
    }
};

export const toggleLikeSpark = async (sparkId: string, email: string) => {
    try {
        await chefuApiClient.post(`/academy-mobile/sparks/${sparkId}/like`, { email });
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

export const deleteSpark = async (sparkId: string) => {
    try {
        await chefuApiClient.delete(`/academy-mobile/sparks/${sparkId}`);
    } catch (error) {
        console.error('Error deleting spark:', error);
        throw error;
    }
};