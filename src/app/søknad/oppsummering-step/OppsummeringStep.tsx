import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import LegeerklæringAttachmentList from '../../components/legeerklæring-file-list/LegeerklæringFileList';
import { SøkerdataContextConsumer } from '../../context/SøkerdataContext';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { getApiDataFromSøknadsdata } from '../../utils/søknadsdataToApiData/getApiDataFromSøknadsdata';
import { ApiValidationError, validateApiValues } from '../../validation/apiValuesValidation';
import { getArbeidsforhold, harArbeidIPerioden, harFraværIPerioden } from '../arbeidstid-step/utils/arbeidstidUtils';
import { useSøknadContext } from '../SøknadContext';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import { getSøknadStepsConfig, StepID } from '../søknadStepsConfig';
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
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { useFormikContext } from 'formik';

interface Props {
    søknadsdato: Date;
}

const OppsummeringStep = ({ søknadsdato }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSøknadContext();
    const { søknadsdata } = useSøknadsdataContext();
    const { values } = useFormikContext<SøknadFormValues>();

    const søknadStepConfig = getSøknadStepsConfig(values);

    const { logSenderInnSøknadMedIngenFravær } = useLogSøknadInfo();

    const onSendSoknad = async ({
        apiValues,
        apiValuesValidationErrors,
        harArbeidMenIngenFravær,
    }: {
        apiValues: SøknadApiData;
        apiValuesValidationErrors: ApiValidationError[] | undefined;
        harArbeidMenIngenFravær: boolean;
    }) => {
        if (!apiValues) {
            return;
        }
        if (harArbeidMenIngenFravær) {
            await logSenderInnSøknadMedIngenFravær();
        }

        if (apiValuesValidationErrors === undefined) {
            setTimeout(() => {
                /** La view oppdatere seg først */
                sendSoknad(apiValues);
            });
        } else {
            document.getElementsByClassName('validationErrorSummary');
        }
    };

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
                console.log('apiValues: ', apiValues);
                return (
                    <SøknadFormStep
                        id={StepID.SUMMARY}
                        includeValidationSummary={false}
                        showButtonSpinner={isPending(sendSoknadStatus.status)}
                        buttonDisabled={isPending(sendSoknadStatus.status)}
                        onSendSoknad={() =>
                            onSendSoknad({ apiValues, apiValuesValidationErrors, harArbeidMenIngenFravær })
                        }>
                        <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                            <FormattedMessage id="steg.oppsummering.info" />
                        </CounsellorPanel>

                        {apiValuesValidationErrors && apiValuesValidationErrors.length > 0 && (
                            <FormBlock>
                                <ApiValidationSummary
                                    errors={apiValuesValidationErrors}
                                    soknadStepsConfig={søknadStepConfig}
                                />
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
                                    <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søknadsperiode.header')}>
                                        <FormattedMessage
                                            id="steg.oppsummering.tidsrom.fomtom"
                                            values={{
                                                fom: `${dayjs(søknadsperiode.from).format('D. MMMM YYYY')}`,
                                                tom: `${dayjs(søknadsperiode.to).format('D. MMMM YYYY')}`,
                                            }}
                                        />
                                    </SummaryBlock>

                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.oppsummering.annenSøkerSammePeriode.header')}>
                                        {apiValues.harMedsøker === true && intlHelper(intl, 'Ja')}
                                        {apiValues.harMedsøker === false && intlHelper(intl, 'Nei')}
                                    </SummaryBlock>

                                    {apiValues.harMedsøker && (
                                        <SummaryBlock
                                            header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                            <FormattedMessage id={apiValues.samtidigHjemme ? 'Ja' : 'Nei'} />
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
                                                <FormattedMessage
                                                    id={
                                                        utenlandsoppholdIPerioden.skalOppholdeSegIUtlandetIPerioden
                                                            ? 'Ja'
                                                            : 'Nei'
                                                    }
                                                />
                                            </SummaryBlock>

                                            {utenlandsoppholdIPerioden.opphold.length > 0 && (
                                                <Box>
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
                                            <SummaryBlock
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.ferieuttakIPerioden.header'
                                                )}>
                                                <FormattedMessage
                                                    id={ferieuttakIPerioden.skalTaUtFerieIPerioden ? 'Ja' : 'Nei'}
                                                />
                                            </SummaryBlock>
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
                                        {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                            intlHelper(intl, 'Ja')}
                                        {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === false &&
                                            intlHelper(intl, 'Nei')}
                                    </SummaryBlock>
                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                        medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                            <Box margin="l">
                                                <SummaryList
                                                    items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                    itemRenderer={renderUtenlandsoppholdSummary}
                                                />
                                            </Box>
                                        )}
                                    <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                        {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                            intlHelper(intl, 'Ja')}
                                        {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === false &&
                                            intlHelper(intl, 'Nei')}
                                    </SummaryBlock>
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
