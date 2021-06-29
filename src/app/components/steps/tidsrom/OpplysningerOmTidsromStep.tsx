import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import FerieuttakListAndDialog from '@navikt/sif-common-forms/lib/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common-forms/lib/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { brukerSkalBekrefteOmsorgForBarnet, brukerSkalBeskriveOmsorgForBarnet } from '../../../utils/tidsromUtils';
import {
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const søkerdata = React.useContext(SøkerdataContext)!;

    const harMedsøker = values[AppFormField.harMedsøker];

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);

    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);
    const periode: DateRange = {
        from: periodeFra || date1YearAgo,
        to: periodeTil || date1YearFromNow,
    };
    const intl = useIntl();

    const validateFraDatoField = (date?: string) => {
        return validateFradato(date, values.periodeTil);
    };

    const validateTilDatoField = (date?: string) => {
        return validateTildato(date, values.periodeFra);
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
                    <ExpandableInfo title={intlHelper(intl, 'steg.tidsrom.hjelpetekst.tittel')}>
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
                disableWeekend={true}
            />

            <ExpandableInfo title={intlHelper(intl, 'steg.tidsrom.hjelpetekst.tittel.1')}>
                <FormattedMessage id="steg.tidsrom.hjelpetekst.1" />
            </ExpandableInfo>

            {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) &&
                brukerSkalBekrefteOmsorgForBarnet(values, søkerdata.barn) && (
                    <>
                        <Box margin="xl">
                            <AppForm.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.skalPassePåBarnetIHelePerioden.spm')}
                                name={AppFormField.skalPassePåBarnetIHelePerioden}
                                validate={getYesOrNoValidator()}
                            />
                        </Box>
                        {brukerSkalBeskriveOmsorgForBarnet(values, søkerdata.barn) && (
                            <Box margin="xl">
                                <AppForm.Textarea
                                    label={intlHelper(intl, 'steg.tidsrom.bekreftOmsorgEkstrainfo.spm')}
                                    name={AppFormField.beskrivelseOmsorgsrolleIPerioden}
                                    validate={getStringValidator({ maxLength: 1000, required: true })}
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
                    validate={getYesOrNoValidator()}
                />
            </Box>

            {harMedsøker === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                        name={AppFormField.samtidigHjemme}
                        validate={getYesOrNoValidator()}
                    />
                </Box>
            )}

            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) && (
                <>
                    <Box margin="xl">
                        <AppForm.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                            name={AppFormField.skalOppholdeSegIUtlandetIPerioden}
                            validate={getYesOrNoValidator()}
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
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.veileder.tittel')}>
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
