import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { purge, sendApplication } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import LegeerklæringAttachmentList from '../../components/legeerklæring-file-list/LegeerklæringFileList';
import routeConfig from '../../config/routeConfig';
import { SøkerdataContextConsumer } from '../../context/SøkerdataContext';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import appSentryLogger from '../../utils/appSentryLogger';
import { navigateTo, relocateToLoginPage } from '../../utils/navigationUtils';
import { getApiDataFromSøknadsdata } from '../../utils/søknadsdataToApiData/getApiDataFromSøknadsdata';
import { validateApiValues } from '../../validation/apiValuesValidation';
import { getArbeidsforhold, harArbeidIPerioden, harFraværIPerioden } from '../arbeidstid-step/utils/arbeidstidUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import { getSøknadStepConfig, StepID } from '../søknadStepsConfig';
import ApiValidationSummary from './api-validation-summary/ApiValidationSummary';
import ArbeidIPeriodenSummary from './arbeid-i-perioden-summary/ArbeidIPeriodenSummary';
import ArbeidssituasjonSummary from './arbeidssituasjon-summary/ArbeidssituasjonSummary';
import BarnSummary from './barn-summary/BarnSummary';
import OmsorgstilbudSummary from './omsorgstilbud-summary/OmsorgstilbudSummary';
import {
    renderFerieuttakIPeriodenSummary,
    renderUtenlandsoppholdIPeriodenSummary,
    renderUtenlandsoppholdSummary,
} from './summaryItemRenderers';
import './oppsummeringStep.less';

interface Props {
    values: SøknadFormValues;
    søknadsdato: Date;
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const OppsummeringStep = ({ onApplicationSent, values, søknadsdato }: Props) => {
    const [sendingInProgress, setSendingInProgress] = useState<boolean>(false);
    const [soknadSent, setSoknadSent] = useState<boolean>(false);
    const intl = useIntl();
    const history = useHistory();

    const { søknadsdata } = useSøknadsdataContext();

    const søknadStepConfig = getSøknadStepConfig(values);

    const { logSoknadSent, logSoknadFailed, logUserLoggedOut } = useAmplitudeInstance();
    const { logSenderInnSøknadMedIngenFravær } = useLogSøknadInfo();

    const sendSoknad = async (apiValues: SøknadApiData, søkerdata: Søkerdata, harArbeidMenIngenFravær: boolean) => {
        if (sendingInProgress) {
            return;
        }
        setSendingInProgress(true);
        try {
            await sendApplication(apiValues);
            await logSoknadSent(SKJEMANAVN);
            if (harArbeidMenIngenFravær) {
                await logSenderInnSøknadMedIngenFravær();
            }
            await purge();
            setSoknadSent(true);
            onApplicationSent(apiValues, søkerdata);
        } catch (error: any) {
            if (isUnauthorized(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed(SKJEMANAVN);
                appSentryLogger.logApiError(error);
                navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    };

    if (soknadSent) {
        // User is redirected to confirmation page
        return null;
    }

    return (
        <SøkerdataContextConsumer>
            {(søkerdata: Søkerdata | undefined) => {
                if (søkerdata === undefined) {
                    return <div>Det oppstod en feil - informasjon om søker mangler</div>;
                }
                if (søknadsdata === undefined) {
                    return <div>Det oppstod en feil - søknadsdata mangler</div>;
                }

                const harArbeidMenIngenFravær: boolean =
                    harArbeidIPerioden(søknadsdata.arbeid) &&
                    harFraværIPerioden(getArbeidsforhold(søknadsdata.arbeid)) === false;

                const {
                    søker: { fornavn, mellomnavn, etternavn, fødselsnummer },
                    barn,
                } = søkerdata;
                const harBekreftetOpplysninger = values.harBekreftetOpplysninger;

                const apiValues = getApiDataFromSøknadsdata(
                    barn,
                    søknadsdata,
                    harBekreftetOpplysninger,
                    intl.locale as Locale
                );
                if (apiValues === undefined) {
                    return <div>Det oppstod en feil - api-data mangler</div>;
                }

                const søknadsperiode: DateRange = {
                    from: apiStringDateToDate(apiValues.fraOgMed),
                    to: apiStringDateToDate(apiValues.tilOgMed),
                };

                const apiValuesValidationErrors = validateApiValues(apiValues, intl);

                const { medlemskap, utenlandsoppholdIPerioden, ferieuttakIPerioden } = apiValues;

                return (
                    <SøknadFormStep
                        id={StepID.SUMMARY}
                        onValidFormSubmit={() => {
                            if (apiValuesValidationErrors === undefined) {
                                setTimeout(() => {
                                    // La view oppdatere seg først
                                    sendSoknad(apiValues, søkerdata, harArbeidMenIngenFravær);
                                });
                            } else {
                                document.getElementsByClassName('validationErrorSummary');
                            }
                        }}
                        useValidationErrorSummary={false}
                        showSubmitButton={apiValuesValidationErrors === undefined}
                        buttonDisabled={sendingInProgress}
                        showButtonSpinner={sendingInProgress}>
                        <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                            <FormattedMessage id="steg.oppsummering.info" />
                        </CounsellorPanel>

                        {apiValuesValidationErrors && apiValuesValidationErrors.length > 0 && (
                            <FormBlock>
                                <ApiValidationSummary
                                    errors={apiValuesValidationErrors}
                                    søknadStepConfig={søknadStepConfig}
                                />
                            </FormBlock>
                        )}

                        <Box margin="xl">
                            <ResponsivePanel border={true}>
                                {/* Om deg */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                    <Box margin="m">
                                        <div data-testid="oppsummering-søker-navn">
                                            {formatName(fornavn, etternavn, mellomnavn)}
                                        </div>
                                        <div data-testid="oppsummering-søker-fødselsnummer">
                                            <FormattedMessage
                                                id={'steg.oppsummering.søker.fnr'}
                                                values={{
                                                    fødselsnummer: fødselsnummer,
                                                }}
                                            />
                                        </div>
                                    </Box>
                                </SummarySection>

                                {/* Om barnet */}
                                <BarnSummary barn={barn} formValues={values} apiValues={apiValues} />

                                {/* Perioden du søker pleiepenger for */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                    <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søknadsperiode.header')}>
                                        <div data-testid="oppsummering-tidsrom-fomtom">
                                            <FormattedMessage
                                                id="steg.oppsummering.tidsrom.fomtom"
                                                values={{
                                                    fom: `${dayjs(søknadsperiode.from).format('D. MMMM YYYY')}`,
                                                    tom: `${dayjs(søknadsperiode.to).format('D. MMMM YYYY')}`,
                                                }}
                                            />
                                        </div>
                                    </SummaryBlock>

                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.oppsummering.annenSøkerSammePeriode.header')}>
                                        <div data-testid="oppsummering-annenSøkerSammePeriode">
                                            <FormattedMessage id={apiValues.harMedsøker ? 'Ja' : 'Nei'} />
                                        </div>
                                    </SummaryBlock>

                                    {apiValues.harMedsøker && (
                                        <SummaryBlock
                                            header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                            <div data-testid="oppsummering-samtidigHjemme">
                                                <FormattedMessage id={apiValues.samtidigHjemme ? 'Ja' : 'Nei'} />
                                            </div>
                                        </SummaryBlock>
                                    )}

                                    {/* Utenlandsopphold i perioden */}
                                    {utenlandsoppholdIPerioden && (
                                        <>
                                            <SummaryBlock
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                )}>
                                                <div data-testid="oppsummering-utenlandsoppholdIPerioden">
                                                    <FormattedMessage
                                                        id={
                                                            utenlandsoppholdIPerioden.skalOppholdeSegIUtlandetIPerioden
                                                                ? 'Ja'
                                                                : 'Nei'
                                                        }
                                                    />
                                                </div>
                                            </SummaryBlock>

                                            {utenlandsoppholdIPerioden.opphold.length > 0 && (
                                                <Box>
                                                    <div data-testid="oppsummering-utenlandsoppholdIPerioden-list">
                                                        <SummaryList
                                                            items={utenlandsoppholdIPerioden.opphold}
                                                            itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                                                        />
                                                    </div>
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    {/* Ferieuttak i perioden */}
                                    {ferieuttakIPerioden && (
                                        <>
                                            <SummaryBlock
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.ferieuttakIPerioden.header'
                                                )}>
                                                <div data-testid="oppsummering-ferieuttakIPerioden">
                                                    <FormattedMessage
                                                        id={ferieuttakIPerioden.skalTaUtFerieIPerioden ? 'Ja' : 'Nei'}
                                                    />
                                                </div>
                                            </SummaryBlock>
                                            {ferieuttakIPerioden.ferieuttak.length > 0 && (
                                                <Box margin="l">
                                                    <div data-testid="oppsummering-ferieuttakIPerioden-list">
                                                        <SummaryList
                                                            items={ferieuttakIPerioden.ferieuttak}
                                                            itemRenderer={renderFerieuttakIPeriodenSummary}
                                                        />
                                                    </div>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </SummarySection>

                                {/* Arbeidssituasjon i søknadsperiode */}
                                <ArbeidssituasjonSummary
                                    apiValues={apiValues}
                                    søknadsperiode={søknadsperiode}
                                    frilansoppdrag={values.frilansoppdrag}
                                />

                                {/* Arbeid i søknadsperiode */}
                                <ArbeidIPeriodenSummary
                                    apiValues={apiValues}
                                    søknadsperiode={søknadsperiode}
                                    søknadsdato={søknadsdato}
                                />

                                {/* Omsorgstilbud */}
                                <OmsorgstilbudSummary søknadsperiode={søknadsperiode} apiValues={apiValues} />

                                {/* Medlemskap i folketrygden */}
                                <SummarySection header={intlHelper(intl, 'medlemskap.summary.header')}>
                                    <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                        <div data-testid="oppsummering-medlemskap-utlandetSiste12">
                                            <FormattedMessage
                                                id={
                                                    apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true
                                                        ? 'Ja'
                                                        : 'Nei'
                                                }
                                            />
                                        </div>
                                    </SummaryBlock>
                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                        medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <div data-testid="oppsummering-medlemskap-utlandetSiste12-list">
                                                    <SummaryList
                                                        items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </div>
                                            </Box>
                                        )}
                                    <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                        <div data-testid="oppsummering-medlemskap-utlandetNeste12">
                                            <FormattedMessage
                                                id={
                                                    apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true
                                                        ? 'Ja'
                                                        : 'Nei'
                                                }
                                            />
                                        </div>
                                    </SummaryBlock>
                                    {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                        medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <div data-testid="oppsummering-medlemskap-utlandetNeste12-list">
                                                    <SummaryList
                                                        items={medlemskap.utenlandsoppholdNeste12Mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </div>
                                            </Box>
                                        )}
                                </SummarySection>

                                {/* Vedlegg */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                                    <Box margin="m">
                                        <div data-testid={'oppsummering-vedleggList'}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </div>
                                    </Box>
                                </SummarySection>
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SøknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                name={SøknadFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </SøknadFormStep>
                );
            }}
        </SøkerdataContextConsumer>
    );
};

export default OppsummeringStep;
