import * as React from 'react';
import { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { FormikProps, useFormikContext } from 'formik';
import { isForbiddenOrUnauthorizedAndWillRedirectToLogin, persist, purge } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ArbeidsforholdApi, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { navigateTo, navigateToWelcomePage } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import BeredskapStep from '../steps/beredskapStep/BeredskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import NattevåkStep from '../steps/nattevåkStep/NattevåkStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import TilsynsordningStep from '../steps/tilsynsordning/TilsynsordningStep';
import FortsettSøknadModalView from '../fortsett-søknad-modal/FortsettSøknadModalView';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { isDate } from 'moment';
import ArbeidsgiverLoader from '../steps/arbeidsforholdStep/ArbeidsgiverLoader';

interface PleiepengesøknadContentProps {
    lastStepID: StepID | undefined;
    formikProps: FormikProps<PleiepengesøknadFormData>;
}

export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsforhold: ArbeidsforholdApi[];
}

const getKvitteringInfoFromApiData = (
    apiValues: PleiepengesøknadApiData,
    søkerdata: Søkerdata
): KvitteringInfo | undefined => {
    const aktiveArbeidsforhold = apiValues.arbeidsgivere.organisasjoner?.filter((o) => o.skalJobbe);
    if (aktiveArbeidsforhold.length > 0) {
        const { fornavn, mellomnavn, etternavn } = søkerdata.person;
        return {
            arbeidsforhold: aktiveArbeidsforhold,
            fom: apiStringDateToDate(apiValues.fraOgMed),
            tom: apiStringDateToDate(apiValues.tilOgMed),
            søkernavn: formatName(fornavn, etternavn, mellomnavn),
        };
    }
    return undefined;
};

const ifAvailable = (stepID: StepID, values: PleiepengesøknadFormData, component: JSX.Element): JSX.Element => {
    if (isAvailable(stepID, values)) {
        return component;
    } else {
        navigateToWelcomePage();
        return <LoadingPage />;
    }
};

const PleiepengesøknadContent = ({ formikProps, lastStepID }: PleiepengesøknadContentProps) => {
    const history = useHistory();
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();

    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const [hasBeenClosed, setHasBeenClosed] = useState<boolean>(false);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonsAreDisabled, setButtonsAreDisabled] = useState<boolean>(false);

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                persist(values, stepId);
                navigateTo(nextStepRoute, history);
            }
        });
    };

    const fortsettPåPåbegyntSøknad = async (lastStepID: StepID): Promise<void> => {
        setButtonsAreDisabled(true);
        await navigateTo(lastStepID, history);
        setButtonsAreDisabled(false);
    };

    const startPåNySøknad = async (): Promise<void> => {
        setButtonsAreDisabled(true);
        try {
            await purge();
            setHasBeenClosed(true);
            formikProps.setFormikState((prevState) => {
                return {
                    ...prevState,
                    values: initialValues,
                };
            });
        } catch (e) {
            const willRedirect: boolean = await isForbiddenOrUnauthorizedAndWillRedirectToLogin(e);
            if (willRedirect) {
                setShowErrorMessage(true);
            } else {
                setIsLoading(true);
            }
        }
        setButtonsAreDisabled(false);
    };
    if (isLoading) {
        return <LoadingPage />;
    }
    if (showErrorMessage) {
        return <GeneralErrorPage />;
    }
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <div>
                        <WelcomingPage
                            onValidSubmit={() =>
                                setTimeout(() => {
                                    navigateTo(
                                        `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`,
                                        history
                                    );
                                })
                            }
                        />
                        {lastStepID && (
                            <FortsettSøknadModalView
                                isOpen={!!lastStepID && !hasBeenClosed}
                                buttonsAreDisabled={buttonsAreDisabled}
                                onRequestClose={startPåNySøknad}
                                onFortsettPåSøknad={() => fortsettPåPåbegyntSøknad(lastStepID)}
                                onStartNySøknad={startPåNySøknad}
                            />
                        )}
                    </div>
                )}
            />

            <Route
                path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.OPPLYSNINGER_OM_BARNET,
                        values,
                        <OpplysningerOmBarnetStep
                            onValidSubmit={() => navigateToNextStep(StepID.OPPLYSNINGER_OM_BARNET)}
                        />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.TIDSROM)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.TIDSROM,
                        values,
                        <OpplysningerOmTidsromStep onValidSubmit={() => navigateToNextStep(StepID.TIDSROM)} />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                exact={true}
                render={() => {
                    if (isAvailable(StepID.ARBEIDSFORHOLD, values) && values.periodeFra && isDate(values.periodeFra)) {
                        return (
                            <ArbeidsgiverLoader
                                periodeFra={values.periodeFra}
                                onValidSubmit={() => navigateToNextStep(StepID.ARBEIDSFORHOLD)}
                            />
                        );
                    }
                    navigateToWelcomePage();
                    return <LoadingPage />;
                }}
            />

            <Route
                path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.OMSORGSTILBUD,
                        values,
                        <TilsynsordningStep onValidSubmit={() => navigateToNextStep(StepID.OMSORGSTILBUD)} />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.NATTEVÅK)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.NATTEVÅK,
                        values,
                        <NattevåkStep onValidSubmit={() => navigateToNextStep(StepID.NATTEVÅK)} />
                    );
                }}
            />

            <Route
                path={getSøknadRoute(StepID.BEREDSKAP)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.BEREDSKAP,
                        values,
                        <BeredskapStep onValidSubmit={() => navigateToNextStep(StepID.BEREDSKAP)} />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.MEDLEMSKAP)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.MEDLEMSKAP,
                        values,
                        <MedlemsskapStep onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)} />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.LEGEERKLÆRING,
                        values,
                        <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />
                    )
                }
            />

            <Route
                path={getSøknadRoute(StepID.SUMMARY)}
                exact={true}
                render={() =>
                    ifAvailable(
                        StepID.SUMMARY,
                        values,
                        <SummaryStep
                            history={history}
                            values={values}
                            onApplicationSent={(apiData: PleiepengesøknadApiData, søkerdata: Søkerdata) => {
                                const info = getKvitteringInfoFromApiData(apiData, søkerdata);
                                setKvitteringInfo(info);
                                setSøknadHasBeenSent(true);
                                resetForm();
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )
                }
            />

            <Route
                path={RouteConfig.SØKNAD_SENDT_ROUTE}
                render={() => {
                    if (søknadHasBeenSent && kvitteringInfo) {
                        return <ConfirmationPage kvitteringInfo={kvitteringInfo} />;
                    } else {
                        navigateToWelcomePage();
                        return <LoadingPage />;
                    }
                }}
            />

            <Route
                path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                component={(): JSX.Element => {
                    navigateToWelcomePage();
                    return <LoadingPage />;
                }}
            />
        </Switch>
    );
};

export default PleiepengesøknadContent;
