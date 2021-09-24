import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { purge, sendApplication } from '../../../api/api';
import { SKJEMANAVN } from '../../../App';
import ArbeidsforholdSummary from '../../arbeidsforhold-summary/ArbeidsforholdSummary';
import {
    renderFerieuttakIPeriodenSummary,
    renderUtenlandsoppholdIPeriodenSummary,
    renderUtenlandsoppholdSummary,
} from './renderUtenlandsoppholdSummary';
import routeConfig from '../../../config/routeConfig';
import { StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { ArbeidsforholdApiData, PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../../types/Søkerdata';
import * as apiUtils from '../../../utils/apiUtils';
import appSentryLogger from '../../../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { navigateTo, relocateToLoginPage } from '../../../utils/navigationUtils';
import { validateApiValues } from '../../../validation/apiValuesValidation';
import AppForm from '../../app-form/AppForm';

import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import SummarySection from '../../summary-section/SummarySection';
import ApiValidationSummary from './ApiValidationSummary';
import BarnSummary from './BarnSummary';
import FrilansSummary from './FrilansSummary';
import HistoriskOmsorgstilbudSummary from './HistoriskOmsorgstilbudSummary';
import JaNeiSvar from './JaNeiSvar';
import PlanlagtOmsorgstilbudSummary from './PlanlagtOmsorgstilbudSummary';
import SelvstendigSummary from './SelvstendigSummary';
import SummaryBlock from './SummaryBlock';
import './summary.less';

interface OwnProps {
    values: PleiepengesøknadFormData;
    onApplicationSent: (apiValues: PleiepengesøknadApiData, søkerdata: Søkerdata) => void;
}

type Props = OwnProps;

const extractAnonymousArbeidsinfo = (values: PleiepengesøknadApiData): string => {
    try {
        const orgs = (values.arbeidsgivere?.organisasjoner || []).map((org) => {
            const { jobberNormaltTimer, skalJobbe } = org;
            const data = {
                jobberNormaltTimer,
                skalJobbe,
            };
            return JSON.stringify(data);
        });
        return orgs.join(';');
    } catch (e) {
        return 'undefined';
    }
};

const SummaryStep = ({ onApplicationSent, values }: Props) => {
    const [sendingInProgress, setSendingInProgress] = useState<boolean>(false);
    const [soknadSent, setSoknadSent] = useState<boolean>(false);
    const intl = useIntl();
    const history = useHistory();

    const { logSoknadSent, logSoknadFailed, logUserLoggedOut } = useAmplitudeInstance();

    const sendSoknad = async (apiValues: PleiepengesøknadApiData, søkerdata: Søkerdata) => {
        setSendingInProgress(true);
        try {
            await sendApplication(apiValues);
            await logSoknadSent(SKJEMANAVN);
            await purge();
            setSoknadSent(true);
            onApplicationSent(apiValues, søkerdata);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed(SKJEMANAVN);
                appSentryLogger.logApiError(error);
                appSentryLogger.logError('Innsending feilet', extractAnonymousArbeidsinfo(apiValues));
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
                    return <div>Det oppstod en feil</div>;
                }
                const {
                    person: { fornavn, mellomnavn, etternavn, fødselsnummer },
                    barn,
                } = søkerdata;

                const apiValues = mapFormDataToApiData(values, barn, intl.locale as Locale);

                if (apiValues === undefined) {
                    return <div>Det oppstod en feil</div>;
                }
                const søknadsperiode: DateRange = {
                    from: apiStringDateToDate(apiValues.fraOgMed),
                    to: apiStringDateToDate(apiValues.tilOgMed),
                };

                const apiValuesValidationErrors = validateApiValues(apiValues, intl);

                const {
                    medlemskap,
                    omsorgstilbudV2,
                    nattevåk,
                    beredskap,
                    utenlandsoppholdIPerioden,
                    ferieuttakIPerioden,
                } = apiValues;

                const mottarAndreYtelserFraNAV =
                    apiValues.andreYtelserFraNAV && apiValues.andreYtelserFraNAV.length > 0;

                const alleArbeidsforhold = [
                    ...apiValues.arbeidsgivere.organisasjoner,
                    ...(apiValues.frilans?.arbeidsforhold ? [apiValues.frilans.arbeidsforhold] : []),
                    ...(apiValues.selvstendigArbeidsforhold ? [apiValues.selvstendigArbeidsforhold] : []),
                ];

                return (
                    <FormikStep
                        id={StepID.SUMMARY}
                        onValidFormSubmit={() => {
                            if (apiValuesValidationErrors === undefined) {
                                setTimeout(() => {
                                    // La view oppdatere seg først
                                    sendSoknad(apiValues, søkerdata);
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
                                <ApiValidationSummary errors={apiValuesValidationErrors} />
                            </FormBlock>
                        )}

                        <Box margin="xl">
                            <ResponsivePanel border={true}>
                                {/* Om deg */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                    <Box margin="m">
                                        <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                        <Normaltekst>Fødselsnummer: {fødselsnummer}</Normaltekst>
                                    </Box>
                                </SummarySection>

                                {/* Om barnet */}
                                <BarnSummary barn={barn} formValues={values} apiValues={apiValues} />

                                {/* Perioden du søker pleiepenger for */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                    <Box margin="m">
                                        <FormattedMessage
                                            id="steg.oppsummering.tidsrom.fomtom"
                                            values={{
                                                fom: prettifyDate(apiStringDateToDate(apiValues.fraOgMed)),
                                                tom: prettifyDate(apiStringDateToDate(apiValues.tilOgMed)),
                                            }}
                                        />
                                    </Box>
                                    <Box margin="m">
                                        <ContentWithHeader
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.annenSøkerSammePeriode.header'
                                            )}>
                                            {apiValues.harMedsøker === true && intlHelper(intl, 'Ja')}
                                            {apiValues.harMedsøker === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.harMedsøker && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                                <FormattedMessage id={apiValues.samtidigHjemme ? 'Ja' : 'Nei'} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                    {/* Utenlandsopphold i perioden */}
                                    {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) &&
                                        utenlandsoppholdIPerioden && (
                                            <>
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                        )}>
                                                        <FormattedMessage
                                                            id={
                                                                utenlandsoppholdIPerioden.skalOppholdeSegIUtlandetIPerioden
                                                                    ? 'Ja'
                                                                    : 'Nei'
                                                            }
                                                        />
                                                    </ContentWithHeader>
                                                </Box>

                                                {utenlandsoppholdIPerioden.opphold.length > 0 && (
                                                    <Box margin="l">
                                                        <SummaryList
                                                            items={utenlandsoppholdIPerioden.opphold}
                                                            itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                                                        />
                                                    </Box>
                                                )}
                                            </>
                                        )}

                                    {/* Ferieuttak i perioden */}
                                    {ferieuttakIPerioden && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.ferieuttakIPerioden.header'
                                                    )}>
                                                    <FormattedMessage
                                                        id={ferieuttakIPerioden.skalTaUtFerieIPerioden ? 'Ja' : 'Nei'}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                            {ferieuttakIPerioden.ferieuttak.length > 0 && (
                                                <Box margin="l">
                                                    <SummaryList
                                                        items={ferieuttakIPerioden.ferieuttak}
                                                        itemRenderer={renderFerieuttakIPeriodenSummary}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </SummarySection>

                                {/* Omsorgstilbud */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.header')}>
                                    <HistoriskOmsorgstilbudSummary
                                        historiskOmsorgstilbud={omsorgstilbudV2?.historisk}
                                        søknadsperiode={søknadsperiode}
                                    />
                                    <PlanlagtOmsorgstilbudSummary
                                        omsorgstilbud={omsorgstilbudV2?.planlagt}
                                        søknadsperiode={søknadsperiode}
                                    />

                                    {nattevåk && (
                                        <>
                                            <Box margin="xl">
                                                <ContentWithHeader
                                                    header={intlHelper(intl, 'steg.oppsummering.nattevåk.header')}>
                                                    {nattevåk.harNattevåk === true && intlHelper(intl, 'Ja')}
                                                    {nattevåk.harNattevåk === false && intlHelper(intl, 'Nei')}
                                                    {nattevåk.harNattevåk === true && nattevåk.tilleggsinformasjon && (
                                                        <TextareaSummary text={nattevåk.tilleggsinformasjon} />
                                                    )}
                                                </ContentWithHeader>
                                            </Box>
                                        </>
                                    )}
                                    {beredskap && (
                                        <Box margin="xl">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.beredskap.header')}>
                                                {beredskap.beredskap === true && intlHelper(intl, 'Ja')}
                                                {beredskap.beredskap === false && intlHelper(intl, 'Nei')}
                                                {beredskap.tilleggsinformasjon && (
                                                    <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                                )}
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                    {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) && apiValues.skalBekrefteOmsorg && (
                                        <Box margin="xl">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.skalPassePåBarnetIHelePerioden.header'
                                                )}>
                                                <JaNeiSvar harSvartJa={apiValues.skalPassePåBarnetIHelePerioden} />
                                            </ContentWithHeader>
                                            {hasValue(apiValues.beskrivelseOmsorgsrollen) && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.bekreftOmsorgEkstrainfo.header'
                                                        )}>
                                                        <TextareaSummary text={apiValues.beskrivelseOmsorgsrollen} />
                                                    </ContentWithHeader>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </SummarySection>

                                {/* Arbeidsforhold */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
                                    {alleArbeidsforhold.length > 0 && (
                                        <SummaryList
                                            items={alleArbeidsforhold}
                                            itemRenderer={(forhold: ArbeidsforholdApiData) => (
                                                <ArbeidsforholdSummary arbeidsforhold={forhold} />
                                            )}
                                        />
                                    )}
                                    {alleArbeidsforhold.length === 0 && (
                                        <Box margin="m">
                                            <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
                                        </Box>
                                    )}
                                </SummarySection>

                                {/* Frilansinntekt */}
                                <SummarySection header={intlHelper(intl, 'frilanser.summary.header')}>
                                    <FrilansSummary apiValues={apiValues} />
                                </SummarySection>

                                {/* Næringsinntekt */}
                                <SelvstendigSummary
                                    virksomhet={
                                        apiValues.selvstendigVirksomheter &&
                                        apiValues.selvstendigVirksomheter.length === 1
                                            ? apiValues.selvstendigVirksomheter[0]
                                            : undefined
                                    }
                                />

                                {/* Vernepliktig */}
                                {apiValues.harVærtEllerErVernepliktig !== undefined && (
                                    <SummarySection header={intlHelper(intl, 'verneplikt.summary.header')}>
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'verneplikt.summary.harVærtEllerErVernepliktig.header'
                                            )}>
                                            <JaNeiSvar harSvartJa={apiValues.harVærtEllerErVernepliktig} />
                                        </SummaryBlock>
                                    </SummarySection>
                                )}

                                {/* Andre ytelser */}
                                {isFeatureEnabled(Feature.ANDRE_YTELSER) && (
                                    <SummarySection header={intlHelper(intl, 'andreYtelser.summary.header')}>
                                        <SummaryBlock
                                            header={intlHelper(intl, 'andreYtelser.summary.mottarAndreYtelser.header')}>
                                            <JaNeiSvar harSvartJa={mottarAndreYtelserFraNAV} />
                                        </SummaryBlock>
                                        {mottarAndreYtelserFraNAV && apiValues.andreYtelserFraNAV && (
                                            <SummaryBlock
                                                header={intlHelper(intl, 'andreYtelser.summary.ytelser.header')}>
                                                <SummaryList
                                                    items={apiValues.andreYtelserFraNAV}
                                                    itemRenderer={(ytelse) => intlHelper(intl, `NAV_YTELSE.${ytelse}`)}
                                                />
                                            </SummaryBlock>
                                        )}
                                    </SummarySection>
                                )}

                                {/* Medlemskap i folketrygden */}
                                <SummarySection header={intlHelper(intl, 'medlemskap.summary.header')}>
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                        medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <SummaryList
                                                    items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                    itemRenderer={renderUtenlandsoppholdSummary}
                                                />
                                            </Box>
                                        )}
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                        medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <SummaryList
                                                    items={medlemskap.utenlandsoppholdNeste12Mnd}
                                                    itemRenderer={renderUtenlandsoppholdSummary}
                                                />
                                            </Box>
                                        )}
                                </SummarySection>

                                {/* Vedlegg */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                                    <Box margin="m">
                                        <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                    </Box>
                                </SummarySection>
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <AppForm.ConfirmationCheckbox
                                label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                name={AppFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </FormikStep>
                );
            }}
        </SøkerdataContextConsumer>
    );
};

export default SummaryStep;
