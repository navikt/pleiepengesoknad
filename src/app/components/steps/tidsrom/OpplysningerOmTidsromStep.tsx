import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
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
import { FieldValidationError } from '@navikt/sif-common/lib/common/validation/types';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { persistAndNavigateTo } from '../../../utils/navigationUtils';
import { getAntallDager, getVarighetString } from '../../../utils/varighetUtils';
import {
    validateFerieuttakIPerioden, validateFradato, validateTildato, validateUtenlandsoppholdIPerioden
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';

interface OpplysningerOmTidsromStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const { values, handleSubmit } = formikProps;

    const fraDato = formikProps.values[AppFormField.periodeFra];
    const tilDato = formikProps.values[AppFormField.periodeTil];
    const harMedsøker = formikProps.values[AppFormField.harMedsøker];

    const { periodeFra, periodeTil } = formikProps.values;
    const periode: DateRange = { from: periodeFra || date1YearAgo, to: periodeTil || date1YearFromNow };
    const intl = useIntl();

    const antallDager = periodeFra && periodeTil ? getAntallDager(periodeFra, periodeTil) : undefined;
    const erOver8uker = antallDager && antallDager > 5 * 8;
    const varighet = antallDager && erOver8uker ? getVarighetString(antallDager, intl) : undefined;

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

        if (value === YesOrNo.NO && erOver8uker && periodeFra && periodeTil) {
            const error: FieldValidationError = {
                key: 'fieldvalidation.periodeErOver8UkerMenIkkeØnsket',
                values: {
                    varighet
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
                    {erOver8uker && (
                        <>
                            <Box margin="xl">
                                <FormikYesOrNoQuestion<AppFormField>
                                    name={AppFormField.søkerPeriodeOver8uker}
                                    legend={`Når du velger en periode som er mer enn 8 uker (${varighet}), må du bekrefte  at du ønsker dette. Ønsker du å søke om mer enn 8 uker med pleiepenger?`}
                                    validate={validateBekreft8uker}
                                />
                            </Box>
                            {values.søkerPeriodeOver8uker === YesOrNo.NO &&
                                !isValidationErrorsVisible(formikProps.status, formikProps.submitCount) && (
                                    <>
                                        <AlertStripeAdvarsel>
                                            For å kunne sende inn en søknad for en periode som er mer enn 8 uker, må du
                                            bekrefte at du ønsker dette for å komme videre. Dersom du ikke bekrefter, må
                                            du redusere redusere varigheten på perioden til maks 8 uker.
                                        </AlertStripeAdvarsel>
                                    </>
                                )}
                        </>
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
                <Box margin="l">
                    <FormikYesOrNoQuestion
                        legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                        name={AppFormField.samtidigHjemme}
                        validate={validateYesOrNoIsAnswered}
                    />
                </Box>
            )}

            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) && (
                <>
                    <Box margin="xxl">
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
                    <Box margin="xxl">
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
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
