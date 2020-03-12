import * as React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
// import moment from 'moment';
import { persist } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ArbeidsforholdApi, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { navigateTo, redirectTo } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import ArbeidsforholdStep from '../steps/arbeidsforholdStep/ArbeidsforholdStep';
import BeredskapStep from '../steps/beredskapStep/BeredskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import NattevåkStep from '../steps/nattevåkStep/NattevåkStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import TilsynsordningStep from '../steps/tilsynsordning/TilsynsordningStep';

interface PleiepengesøknadContentProps {
    lastStepID: StepID;
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
    const aktiveArbeidsforhold = apiValues.arbeidsgivere.organisasjoner?.filter((o) => o.skal_jobbe);
    if (aktiveArbeidsforhold.length > 0) {
        const { fornavn, mellomnavn, etternavn } = søkerdata.person;
        return {
            arbeidsforhold: aktiveArbeidsforhold,
            fom: apiStringDateToDate(apiValues.fra_og_med),
            tom: apiStringDateToDate(apiValues.til_og_med),
            søkernavn: formatName(fornavn, etternavn, mellomnavn)
        };
    }
    return undefined;
};

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({ lastStepID }) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();

    const history = useHistory();

    if (location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE) {
        const nextStepRoute = getNextStepRoute(lastStepID, values);
        if (nextStepRoute) {
            redirectTo(nextStepRoute);
        }
    }

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
                )}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={() => (
                        <OpplysningerOmBarnetStep
                            onValidSubmit={() => navigateToNextStep(StepID.OPPLYSNINGER_OM_BARNET)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={() => (
                        <OpplysningerOmTidsromStep onValidSubmit={() => navigateToNextStep(StepID.TIDSROM)} />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                    render={() => (
                        <ArbeidsforholdStep onValidSubmit={() => navigateToNextStep(StepID.ARBEIDSFORHOLD)} />
                    )}
                />
            )}

            {isAvailable(StepID.OMSORGSTILBUD, values) && (
                <Route
                    path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                    render={() => {
                        return <TilsynsordningStep onValidSubmit={() => navigateToNextStep(StepID.OMSORGSTILBUD)} />;
                    }}
                />
            )}

            {isAvailable(StepID.NATTEVÅK, values) && (
                <Route
                    path={getSøknadRoute(StepID.NATTEVÅK)}
                    render={() => {
                        return <NattevåkStep onValidSubmit={() => navigateToNextStep(StepID.NATTEVÅK)} />;
                    }}
                />
            )}

            {isAvailable(StepID.BEREDSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEREDSKAP)}
                    render={() => {
                        return <BeredskapStep onValidSubmit={() => navigateToNextStep(StepID.BEREDSKAP)} />;
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)} />}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
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
                    )}
                />
            )}

            {isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) && søknadHasBeenSent === true && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => <ConfirmationPage kvitteringInfo={kvitteringInfo} />}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

// const mockKvitteringInfo: KvitteringInfo = {
//     fom: moment()
//         .subtract(4, 'week')
//         .toDate(),
//     tom: moment()
//         .subtract(1, 'week')
//         .toDate(),
//     søkernavn: 'Frode Hansen',
//     arbeidsforhold: [
//         {
//             navn: 'BEKK Consulting AS'
//         }
//     ]
// };

export default PleiepengesøknadContent;
