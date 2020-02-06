import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';

import FerieuttakIPeriodenFormPart from './FerieuttakIPeriodenFormPart';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { validateFradato, validateTildato } from '../../../validation/fieldValidations';
import { HistoryProps } from '@navikt/sif-common/lib/common/types/History';
import {
    date1YearAgo,
    date1YearFromNow,
    DateRange,
    date3YearsAgo
} from '@navikt/sif-common/lib/common/utils/dateUtils';
import FormikStep from '../../formik-step/FormikStep';
import { persistAndNavigateTo } from '../../../utils/navigationUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import FormikYesOrNoQuestion from '@navikt/sif-common/lib/common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
import UtenlandsoppholdIPeriodenFormPart from './UtenlandsoppholdIPeriodenFormPart';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';

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

    const validateFraDatoField = (date?: Date) => {
        return validateFradato(date, periodeTil);
    };

    const validateTilDatoField = (date?: Date) => {
        return validateTildato(date, periodeFra);
    };

    const periode: DateRange = { from: periodeFra || date1YearAgo, to: periodeTil || date1YearFromNow };
    const intl = useIntl();

    const visInfoOmUtenlandsopphold = harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning(
        values.utenlandsoppholdIPerioden
    );

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
                        minDato: date3YearsAgo.toDate(),
                        maksDato: validateTilDatoField(tilDato) === undefined ? tilDato : undefined
                    }
                }}
                toDatepickerProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                    validate: validateTilDatoField,
                    name: AppFormField.periodeTil,
                    dateLimitations: {
                        minDato: validateFraDatoField(fraDato) === undefined ? fraDato : date3YearsAgo.toDate()
                    }
                }}
            />

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

            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) && (
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
                            <UtenlandsoppholdIPeriodenFormPart periode={periode} />
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
                    <Box margin="l">
                        <FormikYesOrNoQuestion<AppFormField>
                            legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                            name={AppFormField.skalTaUtFerieIPerioden}
                            validate={validateYesOrNoIsAnswered}
                            helperText={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.veileder')}
                        />
                    </Box>
                    {formikProps.values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                        <Box margin="m" padBottom="l">
                            <FerieuttakIPeriodenFormPart periode={periode} />
                        </Box>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
