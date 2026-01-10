import { showToast } from '@/utils/toast';
import { Href } from 'expo-router';

type RoutePath = Extract<Href, { pathname: string }>['pathname'];

type UseSearchHandlerProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    safePush: (href: Href) => void;
    resultsPath?: RoutePath;
};

export const useSearchHandler = ({
    searchTerm,
    setSearchTerm,
    safePush,
    resultsPath = '/searchResults',
}: UseSearchHandlerProps) => {
    const handleSearch = () => {
        const trimmed = searchTerm.trim();

        if (!trimmed) {
            showToast('Please enter a search term');
            return;
        }

        safePush({
            pathname:  '/searchResults',
            params: { query: trimmed },
        });

        setSearchTerm('');
    };

    return { handleSearch };
};
