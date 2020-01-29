import * as React from 'react';
import { HistoryProps } from 'common/types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import FormikDateIntervalPicker from '../../../../common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import { date3YearsAgo, DateRange, date1YearFromNow, date1YearAgo } from 'common/utils/dateUtils';
import { validateYesOrNoIsAnswered, validateFradato, validateTildato } from '../../../validation/fieldValidations';
import FormikYesOrNoQuestion from '../../../../common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { persist } from 'app/api/api';

import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import FerieuttakIPeriodenFormPart from './FerieuttakIPeriodenFormPart';
import UtenlandsoppholdIPeriodenFormPart from './UtenlandsoppholdIPeriodenFormPart';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface OpplysningerOmTidsromStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const { values, handleSubmit } = formikProps;

    const persistAndNavigateTo = (lastStepID: StepID, data: PleiepengesøknadFormData, nextStep?: string) => {
        persist(data, lastStepID);
        if (nextStep) {
            history.push(nextStep);
        }
    };

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

    return (
        <FormikStep
            id={StepID.TIDSROM}
            onValidFormSubmit={() => persistAndNavigateTo(StepID.TIDSROM, values, nextStepRoute)}
            formValues={values}
            handleSubmit={handleSubmit}
            history={history}
            {...stepProps}>
            <Box padBottom="xxl">
                <AlertStripeInfo>
                    For å ha rett til pleiepenger må du ha omsorgen for barnet i hele perioden du søker for.
                </AlertStripeInfo>
            </Box>
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
                        <CounsellorPanel>
                            Du kan beholde pleiepengene mens du oppholder deg <strong>i et EØS land</strong>, så lenge
                            du
                            <ul>
                                <li>du reiser sammen med barnet du pleier</li>
                                <li>har rett på pleiepenger i perioden du er i utlandet</li>
                            </ul>
                            Hvis du oppholder deg <strong>i et EØS land</strong>, kan du beholde pleiepengene i opptil 8
                            uker av en 12 måneder lang periode.
                        </CounsellorPanel>
                    </Box>
                    <Box margin="xxl">
                        <FormikYesOrNoQuestion<AppFormField>
                            legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                            name={AppFormField.skalOppholdeSegIUtlandetIPerioden}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </Box>
                    {formikProps.values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                        <Box margin="m" padBottom="l">
                            <UtenlandsoppholdIPeriodenFormPart periode={periode} />
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
