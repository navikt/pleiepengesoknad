import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StepID } from '../søknad/søknadStepsConfig';
import { useHasChanged } from './useHasChanged';
import usePersistSoknad from './usePersistSoknad';

const DELAY_MS = 5000;

/** Lagrer hvert 5 sekund */

const usePersistOnChange = <T>(values: T, loaded: boolean, stepID: StepID) => {
    const history = useHistory();
    const { persist } = usePersistSoknad(history);
    const [timerId, setTimerId] = useState<any>();

    const delayedPersist = () => {
        persist(stepID);
        setTimerId(undefined);
    };

    const requestPersist = () => {
        if (timerId) {
            window.clearTimeout(timerId);
        }
        const newTimerId = setTimeout(() => {
            delayedPersist();
        }, DELAY_MS);
        setTimerId(newTimerId);
    };

    useHasChanged(values, () => {
        if (loaded) {
            requestPersist();
        }
    });

    useEffect(() => {
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [timerId]);
};

export default usePersistOnChange;
