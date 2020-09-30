import * as React from 'react';
import { useEffect, useState } from 'react';
import { MaybeMellomlagringData, validateMellomlagringsData } from '../../types/storage';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { StepID } from '../../config/stepConfig';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Either, fold, isLeft } from 'fp-ts/Either';
import { navigateTo } from '../../utils/navigationUtils';
import { getSøknadRoute } from '../../utils/routeUtils';

interface Props {
    maybeMellomlagringData: MaybeMellomlagringData;
    render: (formdata: PleiepengesøknadFormData) => JSX.Element;
}

const MellomlagringsHandler = ({ maybeMellomlagringData, render }: Props): JSX.Element => {
    const history = useHistory();
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    const mellomlagringsdataOrInitialValues: Either<
        [PleiepengesøknadFormData, StepID],
        PleiepengesøknadFormData
    > = validateMellomlagringsData(maybeMellomlagringData, initialValues);

    useEffect(() => {
        if (isInitializing && isLeft(mellomlagringsdataOrInitialValues)) {
            const stepId: StepID = mellomlagringsdataOrInitialValues.left[1];
            navigateTo(getSøknadRoute(stepId), history);
        }
        setIsInitializing(false);
    }, []);

    if (isInitializing) {
        return <LoadingPage />;
    }

    return render(
        fold(
            ([mellomlagringsdata, stepId]: [PleiepengesøknadFormData, StepID]) => {
                return mellomlagringsdata;
            },
            (initialValues: PleiepengesøknadFormData) => {
                return initialValues;
            }
        )(mellomlagringsdataOrInitialValues)
    );
};

export default MellomlagringsHandler;
