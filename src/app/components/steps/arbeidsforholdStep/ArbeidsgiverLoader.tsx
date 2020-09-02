import React, { useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import LoadingSpinner from '@sif-common/core/components/loading-spinner/LoadingSpinner';
import { PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { updateArbeidsforhold } from 'app/utils/arbeidsforholdUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import FormikStep from '../../formik-step/FormikStep';
import { ArbeidsgiverResponse, arbeidsgiverResponseRecipe } from '../../../types/ArbeidsgiverResponse';
import useFetcher from '../../../utils/fetcher/fetcher';
import { fetch1 } from '../../../utils/fetcher/fetcherUtils';
import { fold, isSuccess, RemoteData } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import RemoteDataHandler from '../../../utils/fetcher/RemoteDataHandler';
import RedirectIfUnauthorized from '../../../utils/handleUnauthorized/RedirectIfUnauthorized';
import GeneralErrorPage from '../../pages/general-error-page/GeneralErrorPage';
import { formatDateToApiFormat } from '@sif-common/core/utils/dateUtils';
import ArbeidsforholdStep from './ArbeidsforholdStep';

export interface OwnProps {
    periodeFra: Date;
}

export type Props = OwnProps & StepConfigProps;

const ArbeidsgiverLoader = ({ onValidSubmit, periodeFra }: Props) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const søkerdata = useContext(SøkerdataContext);
    const remoteData: RemoteData<AxiosError, [ArbeidsgiverResponse]> = useFetcher(() =>
        fetch1([arbeidsgiverResponseRecipe(formatDateToApiFormat(periodeFra), formatDateToApiFormat(periodeFra))])
    );

    useEffect(() => {
        if (søkerdata) {
            fold(
                () => {},
                () => {},
                () => {},
                ([{ organisasjoner }]: [ArbeidsgiverResponse]) => {
                    updateArbeidsforhold(formikProps, organisasjoner);
                }
            )(remoteData);
        }
    }, [remoteData]);

    const loadingSpinner = () => <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />;
    const redirectIfUnauthorizedOrGeneralErrorPage = (error: AxiosError) => (
        <RedirectIfUnauthorized
            error={error}
            onWillRedirect={() => <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
            handleError={(error: AxiosError) => <GeneralErrorPage error={error} />}
        />
    );

    return (
        <FormikStep
            id={StepID.ARBEIDSFORHOLD}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={!isSuccess(remoteData)}>
            <RemoteDataHandler<[ArbeidsgiverResponse]>
                remoteData={remoteData}
                initializing={loadingSpinner}
                loading={loadingSpinner}
                error={redirectIfUnauthorizedOrGeneralErrorPage}
                success={([arbeidsgiverResponse]: [ArbeidsgiverResponse]) => <ArbeidsforholdStep />}
            />
        </FormikStep>
    );
};

export default ArbeidsgiverLoader;
