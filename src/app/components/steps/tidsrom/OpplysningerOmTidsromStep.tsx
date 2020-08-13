import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@sif-common/core/components/box/Box';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import { IntlFieldValidationError } from '@sif-common/core/validation/types';
import { TypedFormikFormContext } from '@sif-common/formik/';
import FerieuttakListAndDialog from '@sif-common/forms/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '@sif-common/forms/ferieuttak/types';
import { Utenlandsopphold } from '@sif-common/forms/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from '@sif-common/forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import ExpandableInfo from '@sif-common/core/components/expandable-content/ExpandableInfo';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { erPeriodeOver8Uker } from '../../../utils/søkerOver8UkerUtils';
import { brukerSkalBekrefteOmsorgForBarnet, brukerSkalBeskriveOmsorgForBarnet } from '../../../utils/tidsromUtils';
import { getVarighetString } from '../../../utils/varighetUtils';
import {
    validateBekreftOmsorgEkstrainfo,
    validateFerieuttakIPerioden,
    validateFradato,
    validateTildato,
    validateUtenlandsoppholdIPerioden,
} from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';

const OpplysningerOmTidsromStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { showErrors } = React.useContext(TypedFormikFormContext) || { showErrors: false };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const søkerdata = React.useContext(SøkerdataContext)!;

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
                    varighet: getVarighetString(info8uker.antallDager, intl),
                },
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
            <AppForm.DateRangePicker
                legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                minDate={date3YearsAgo}
                description={
                    <ExpandableInfo title="Kan jeg søke for flere perioder samtidig?">
                        <FormattedMessage id="steg.tidsrom.hjelpetekst" />
                    </ExpandableInfo>
                }
                fromInputProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                    validate: validateFraDatoField,
                    name: AppFormField.periodeFra,
                }}
                toInputProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                    validate: validateTilDatoField,
                    name: AppFormField.periodeTil,
                }}
            />
            {isFeatureEnabled(Feature.TOGGLE_8_UKER) && (
                <>
                    {info8uker?.erOver8Uker && (
                        <>
                            <Box margin="xl">
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.bekrefterPeriodeOver8uker}
                                    legend={intlHelper(intl, 'steg.tidsrom.over8uker')}
                                    validate={validateBekreft8uker}
                                />
                            </Box>
                            {values.bekrefterPeriodeOver8uker === YesOrNo.NO && !showErrors && (
                                <Box margin="m">
                                    <AlertStripeAdvarsel>
                                        <FormattedMessage id="steg.tidsrom.over8uker.veileder" />
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}

            {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) &&
                brukerSkalBekrefteOmsorgForBarnet(values, søkerdata.barn) && (
                    <>
                        <Box margin="xl">
                            <AppForm.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.skalPassePåBarnetIHelePerioden.spm')}
                                name={AppFormField.skalPassePåBarnetIHelePerioden}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                        {brukerSkalBeskriveOmsorgForBarnet(values, søkerdata.barn) && (
                            <Box margin="xl">
                                <AppForm.Textarea
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
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.tidsrom.annenSamtidig.spm')}
                    name={AppFormField.harMedsøker}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>

            {harMedsøker === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                        name={AppFormField.samtidigHjemme}
                        validate={validateYesOrNoIsAnswered}
                    />
                </Box>
            )}

            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) && (
                <>
                    <Box margin="xl">
                        <AppForm.YesOrNoQuestion
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
                                <FormattedMessage id="steg.tidsrom.veileder.utenlandsopphold" />
                            </CounsellorPanel>
                        </Box>
                    )}
                </>
            )}

            <Box margin="xl">
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                    name={AppFormField.skalTaUtFerieIPerioden}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title="Hva er lovbestemt ferie?">
                            <FormattedMessage id="steg.tidsrom.ferieuttakIPerioden.veileder" />
                        </ExpandableInfo>
                    }
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
                            addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel'),
                        }}
                        validate={
                            periode ? (ferie: Ferieuttak[]) => validateFerieuttakIPerioden(periode, ferie) : undefined
                        }
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
