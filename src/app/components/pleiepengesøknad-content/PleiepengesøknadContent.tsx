import * as React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
import { persist } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ArbeidsforholdApi, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { navigateTo, navigateToWelcomePage } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import BeredskapStep from '../steps/beredskapStep/BeredskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import NattevåkStep from '../steps/nattevåkStep/NattevåkStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import TilsynsordningStep from '../steps/tilsynsordning/TilsynsordningStep';
import LoadingPage from '../pages/loading-page/LoadingPage';
import ArbeidsgiverLoader from '../steps/arbeidsforholdStep/ArbeidsgiverLoader';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';

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
        return <GeneralErrorPage />;
    }
};

const PleiepengesøknadContent = () => {
    const history = useHistory();
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();

    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                persist(values, stepId);
                navigateTo(nextStepRoute, history);
            }
        });
    };

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
                    if (isAvailable(StepID.ARBEIDSFORHOLD, values) && values.periodeFra) {
                        return (
                            <ArbeidsgiverLoader
                                periodeFra={values.periodeFra}
                                onValidSubmit={() => navigateToNextStep(StepID.ARBEIDSFORHOLD)}
                            />
                        );
                    }
                    return <GeneralErrorPage />;
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
                    if (søknadHasBeenSent) {
                        return <ConfirmationPage kvitteringInfo={kvitteringInfo} />;
                    } else {
                        return <GeneralErrorPage />;
                    }
                }}
            />

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} exact={true} render={() => <GeneralErrorPage />} />

            <Route
                path={'/'}
                exact={false}
                component={(): JSX.Element => {
                    navigateToWelcomePage(history);
                    return <LoadingPage />;
                }}
            />
        </Switch>
    );
};

export default PleiepengesøknadContent;
