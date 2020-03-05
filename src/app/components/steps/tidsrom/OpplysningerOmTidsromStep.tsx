import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
import LoadingSpinner from '@navikt/sif-common/lib/common/components/loading-spinner/LoadingSpinner';
import FormikTextarea from '@navikt/sif-common/lib/common/formik/formik-textarea/FormikTextarea';
import FormikYesOrNoQuestion from '@navikt/sif-common/lib/common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { isValidationErrorsVisible } from '@navikt/sif-common/lib/common/formik/formikUtils';
import FerieuttakListAndDialog from '@navikt/sif-common/lib/common/forms/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '@navikt/sif-common/lib/common/forms/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common/lib/common/forms/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common/lib/common/forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { HistoryProps } from '@navikt/sif-common/lib/common/types/History';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import {
    date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange
} from '@navikt/sif-common/lib/common/utils/dateUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import {
    validateYesOrNoIsAnswered
} from '@navikt/sif-common/lib/common/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common/lib/common/validation/hasValue';
import { FieldValidationError } from '@navikt/sif-common/lib/common/validation/types';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import { getSkalBekrefteOmsorg } from '../../../api/api';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { persistAndNavigateTo } from '../../../utils/navigationUtils';
import { skalSjekkeOmBrukerMåBekrefteOmsorgIPerioden } from '../../../utils/omsorgUtils';
import { erPeriodeOver8Uker } from '../../../utils/søkerOver8UkerUtils';
import { getVarighetString } from '../../../utils/varighetUtils';
import {
    validateBekreftOmsorgEkstrainfo, validateFerieuttakIPerioden, validateFradato, validateTildato,
    validateUtenlandsoppholdIPerioden
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';

interface OpplysningerOmTidsromStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const { values, handleSubmit } = formikProps;
    const [isLoading, setIsLoading] = React.useState(false);

    const fraDato = formikProps.values[AppFormField.periodeFra];
    const tilDato = formikProps.values[AppFormField.periodeTil];
    const harMedsøker = formikProps.values[AppFormField.harMedsøker];

    const { periodeFra, periodeTil } = formikProps.values;
    const periode: DateRange = { from: periodeFra || date1YearAgo, to: periodeTil || date1YearFromNow };
    const intl = useIntl();

    const barnHarBareFødselsdato: boolean =
        values.søknadenGjelderEtAnnetBarn === true &&
        !hasValue(values.barnetsFødselsnummer) &&
        hasValue(values.barnetsFødselsdato);

    const info8uker = periodeFra && periodeTil ? erPeriodeOver8Uker(periodeFra, periodeTil) : undefined;

    React.useEffect(() => {
        const fetchData = async () => {
            const erRegistrertBarn =
                values.barnetSøknadenGjelder !== undefined && values.søknadenGjelderEtAnnetBarn !== true;
            const result = await getSkalBekrefteOmsorg(values.barnetSøknadenGjelder, erRegistrertBarn);
            formikProps.setFieldValue(AppFormField.skalBekrefteOmsorg, result.data.skalBekrefteOmsorg === true);
            setIsLoading(false);
        };
        if (
            isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) &&
            !barnHarBareFødselsdato &&
            skalSjekkeOmBrukerMåBekrefteOmsorgIPerioden(values)
        ) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    const validateFraDatoField = (date?: Date) => {
        return validateFradato(date, periodeTil);
    };

    const validateTilDatoField = (date?: Date) => {
        return validateTildato(date, periodeFra);
    };

    const validateBekreft8uker = (value: YesOrNo): FieldValidationError | undefined => {
        const err = validateYesOrNoIsAnswered(value);
        if (err) {
            return err;
        }

        if (value === YesOrNo.NO && info8uker && info8uker?.erOver8Uker) {
            const error: FieldValidationError = {
                key: 'fieldvalidation.periodeErOver8UkerMenIkkeØnsket',
                values: {
                    varighet: getVarighetString(info8uker.antallDager, intl)
                }
            };
            return error;
        }
        return undefined;
    };

    const visInfoOmUtenlandsopphold =
        values.utenlandsoppholdIPerioden &&
        harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning(values.utenlandsoppholdIPerioden);

    return (
        <FormikStep
            id={StepID.TIDSROM}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.TIDSROM, values, nextStepRoute)}
            formValues={values}
            handleSubmit={handleSubmit}
            history={history}
            {...stepProps}>
            {isLoading && <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <FormikDateIntervalPicker<AppFormField>
                        legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                        helperText={intlHelper(intl, 'steg.tidsrom.hjelpetekst')}
                        fromDatepickerProps={{
                            label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                            validate: validateFraDatoField,
                            name: AppFormField.periodeFra,
                            dateLimitations: {
                                minDato: date3YearsAgo,
                                maksDato: validateTilDatoField(tilDato) === undefined ? tilDato : undefined
                            }
                        }}
                        toDatepickerProps={{
                            label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                            validate: validateTilDatoField,
                            name: AppFormField.periodeTil,
                            dateLimitations: {
                                minDato: validateFraDatoField(fraDato) === undefined ? fraDato : date3YearsAgo
                            }
                        }}
                    />
                    {isFeatureEnabled(Feature.TOGGLE_8_UKER) && (
                        <>
                            {info8uker?.erOver8Uker && (
                                <>
                                    <Box margin="xl">
                                        <FormikYesOrNoQuestion<AppFormField>
                                            name={AppFormField.bekrefterPeriodeOver8uker}
                                            legend={`Når du velger en periode som er mer enn 8 uker (${getVarighetString(
                                                info8uker.antallDager,
                                                intl
                                            )}), må du bekrefte  at du ønsker dette. Ønsker du å søke om mer enn 8 uker med pleiepenger?`}
                                            validate={validateBekreft8uker}
                                        />
                                    </Box>
                                    {values.bekrefterPeriodeOver8uker === YesOrNo.NO &&
                                        !isValidationErrorsVisible(formikProps.status, formikProps.submitCount) && (
                                            <>
                                                <AlertStripeAdvarsel>
                                                    For å kunne sende inn en søknad for en periode som er mer enn 8
                                                    uker, må du bekrefte at du ønsker dette for å komme videre. Dersom
                                                    du ikke bekrefter, må du redusere redusere varigheten på perioden
                                                    til maks 8 uker.
                                                </AlertStripeAdvarsel>
                                            </>
                                        )}
                                </>
                            )}
                        </>
                    )}

                    {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) &&
                        (values.skalBekrefteOmsorg || barnHarBareFødselsdato) && (
                            <>
                                <Box margin="xl">
                                    <FormikYesOrNoQuestion<AppFormField>
                                        legend={intlHelper(intl, 'steg.tidsrom.skalPassePåBarnetIHelePerioden.spm')}
                                        name={AppFormField.skalPassePåBarnetIHelePerioden}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {(barnHarBareFødselsdato || values.skalPassePåBarnetIHelePerioden === YesOrNo.NO) && (
                                    <Box margin="xl">
                                        <FormikTextarea<AppFormField>
                                            label={intlHelper(intl, 'steg.tidsrom.bekreftOmsorgEkstrainfo.spm')}
                                            name={AppFormField.beskrivelseOmsorgsrolleIPerioden}
                                            validate={validateBekreftOmsorgEkstrainfo}
                                            maxLength={1000}
                                        />
                                    </Box>
                                )}
                            </>
                        )}

                    <Box margin="xl">
                        <FormikYesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.annenSamtidig.spm')}
                            name={AppFormField.harMedsøker}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </Box>

                    {harMedsøker === YesOrNo.YES && (
                        <Box margin="xl">
                            <FormikYesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                                name={AppFormField.samtidigHjemme}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    )}

                    {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) && (
                        <>
                            <Box margin="xl">
                                <FormikYesOrNoQuestion<AppFormField>
                                    legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                                    name={AppFormField.skalOppholdeSegIUtlandetIPerioden}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </Box>
                            {formikProps.values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                                <Box margin="m">
                                    <UtenlandsoppholdListAndDialog<AppFormField>
                                        name={AppFormField.utenlandsoppholdIPerioden}
                                        minDate={periode.from}
                                        maxDate={periode.to}
                                        labels={{
                                            modalTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.modalTitle'),
                                            listTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.listTitle'),
                                            addLabel: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.addLabel'),
                                            emptyListText: 'Ingen utenlandsopphold er registrert'
                                        }}
                                        validate={
                                            periode
                                                ? (opphold: Utenlandsopphold[]) =>
                                                      validateUtenlandsoppholdIPerioden(periode, opphold)
                                                : undefined
                                        }
                                    />
                                </Box>
                            )}
                            {visInfoOmUtenlandsopphold && (
                                <Box margin="l" padBottom="l">
                                    <CounsellorPanel>
                                        <FormattedHTMLMessage id="steg.tidsrom.veileder.utenlandsopphold.html" />
                                    </CounsellorPanel>
                                </Box>
                            )}
                        </>
                    )}

                    {isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK) && (
                        <>
                            <Box margin="xl">
                                <FormikYesOrNoQuestion<AppFormField>
                                    legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                                    name={AppFormField.skalTaUtFerieIPerioden}
                                    validate={validateYesOrNoIsAnswered}
                                    helperText={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.veileder')}
                                />
                            </Box>
                            {formikProps.values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                                <Box margin="m" padBottom="l">
                                    <FerieuttakListAndDialog<AppFormField>
                                        name={AppFormField.ferieuttakIPerioden}
                                        minDate={periode.from}
                                        maxDate={periode.to}
                                        labels={{
                                            modalTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.modalTitle'),
                                            listTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.listTitle'),
                                            addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel')
                                        }}
                                        validate={
                                            periode
                                                ? (ferie: Ferieuttak[]) => validateFerieuttakIPerioden(periode, ferie)
                                                : undefined
                                        }
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
