import { useUi } from '../../../shared/context/UiContext';
import { useData } from '../../../shared/context/DataContext';
import { cleanRedis } from '../services/spotifyService';

export const useResetValues = (setCharts, setSource) => {
    const { setShowResults, setIsLoading } = useUi();
    const { setUsername, setTimespan, setCategory } = useData();

    return async () => {
        setShowResults(false);
        setIsLoading(false);
        setUsername('');
        setTimespan('');
        setCategory('');
        setCharts([]);
        setSource('');

        await cleanRedis();
    };
};
