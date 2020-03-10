import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { IntlFieldValidationError } from '@navikt/sif-common-core/lib/validation/types';
import { TypedFormikFormContext } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikDateIntervalPicker from 'common/formik/components/formik-date-interval-picker/FormikDateIntervalPicker';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import FerieuttakListAndDialog from 'common/forms/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from 'common/forms/ferieuttak/types';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from 'common/forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { erPeriodeOver8Uker } from '../../../utils/søkerOver8UkerUtils';
import { getVarighetString } from '../../../utils/varighetUtils';
import {
    validateFerieuttakIPerioden, validateFradato, validateTildato, validateUtenlandsoppholdIPerioden
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';

const OpplysningerOmTidsromStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { showErrors } = React.useContext(TypedFormikFormContext) || { showErrors: false };

    const fraDato = values[AppFormField.periodeFra];
    const tilDato = values[AppFormField.periodeTil];
    const harMedsøker = values[AppFormField.harMedsøker];

    const { periodeFra, periodeTil } = values;
    const periode: DateRange = { from: periodeFra || date1YearAgo, to: periodeTil || date1YearFromNow };
    const intl = useIntl();

    const info8uker = periodeFra && periodeTil ? erPeriodeOver8Uker(periodeFra, periodeTil) : undefined;

    const validateFraDatoField = (date?: Date) => {
        return validateFradato(date, periodeTil);
    };

    const validateTilDatoField = (date?: Date) => {
        return validateTildato(date, periodeFra);
    };

    const validateBekreft8uker = (value: YesOrNo): IntlFieldValidationError | undefined => {
        const err = validateYesOrNoIsAnswered(value);
        if (err) {
            return err;
        }

        if (value === YesOrNo.NO && info8uker && info8uker?.erOver8Uker) {
            const error: IntlFieldValidationError = {
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
        <FormikStep id={StepID.TIDSROM} onValidFormSubmit={onValidSubmit}>
            <FormikDateIntervalPicker<AppFormField>
                legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                info={intlHelper(intl, 'steg.tidsrom.hjelpetekst')}
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
                            {values.bekrefterPeriodeOver8uker === YesOrNo.NO && showErrors && (
                                <>
                                    <AlertStripeAdvarsel>
                                        For å kunne sende inn en søknad for en periode som er mer enn 8 uker, må du
                                        bekrefte at du ønsker dette for å komme videre. Dersom du ikke bekrefter, må du
                                        redusere redusere varigheten på perioden til maks 8 uker.
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
                    {values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
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
                            info={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.veileder')}
                        />
                    </Box>
                    {values.skalTaUtFerieIPerioden === YesOrNo.YES && (
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
