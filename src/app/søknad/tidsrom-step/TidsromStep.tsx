import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import FerieuttakListAndDialog from '@navikt/sif-common-forms/lib/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common-forms/lib/utenlandsopphold/UtenlandsoppholdListAndDialog';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { useFormikContext } from 'formik';
import Alertstripe from 'nav-frontend-alertstriper';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import {
    validateFerieuttakIPerioden,
    validateFradato,
    validateTildato,
    validateUtenlandsoppholdIPerioden,
} from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning from './harUtenlandsoppholdUtenInnleggelseEllerInnleggelseForEgenRegning';
import { skalViseUsikker } from '../omsorgstilbud-step/omsorgstilbudStepUtils';

dayjs.extend(minMax);

export const cleanupTidsromStep = (values: SøknadFormData, søknadsperiode: DateRange): SøknadFormData => {
    const cleanedValues = { ...values };
    const inkluderUsikker = skalViseUsikker(søknadsperiode);

    if (cleanedValues.omsorgstilbud && !inkluderUsikker) {
        cleanedValues.omsorgstilbud.erIOmsorgstilbud = YesOrNo.UNANSWERED;
        cleanedValues.omsorgstilbud.fastIOmsorgstilbud = undefined;
    }

    return cleanedValues;
};

const TidsromStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const søkerdata = React.useContext(SøkerdataContext)!;

    const barnetSøknadenGjelder = values.barnetSøknadenGjelder
        ? søkerdata.barn.find((barn) => barn.aktørId === values.barnetSøknadenGjelder)
        : undefined;

    const harMedsøker = values[SøknadFormField.harMedsøker];

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);

    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);
    const periode: DateRange = {
        from: periodeFra || date1YearAgo,
        to: periodeTil || date1YearFromNow,
    };
    const intl = useIntl();

    const validateFraDatoField = (date?: string) => {
        return validateFradato(date, values.periodeTil, barnetSøknadenGjelder?.fødselsdato);
    };

    const validateTilDatoField = (date?: string) => {
        return validateTildato(date, values.periodeFra);
    };

    const visInfoOmUtenlandsopphold =
        values.utenlandsoppholdIPerioden &&
        harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning(values.utenlandsoppholdIPerioden);

    return (
        <SøknadFormStep
            id={StepID.TIDSROM}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={!søkerKunHelgedager(values.periodeFra, values.periodeTil)}
            onStepCleanup={() => cleanupTidsromStep(values, periode)}>
            <SøknadFormComponents.DateRangePicker
                legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                minDate={
                    barnetSøknadenGjelder?.fødselsdato
                        ? dayjs
                              .max(
                                  dayjs(date3YearsAgo).endOf('day'),
                                  dayjs(barnetSøknadenGjelder?.fødselsdato).endOf('day')
                              )
                              .toDate()
                        : date3YearsAgo
                }
                fromInputProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                    validate: validateFraDatoField,
                    name: SøknadFormField.periodeFra,
                }}
                toInputProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                    validate: validateTilDatoField,
                    name: SøknadFormField.periodeTil,
                    dayPickerProps: { initialMonth: periodeFra ? new Date(periodeFra) : undefined },
                }}
                disableWeekend={false}
            />
            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Box padBottom="xl">
                    <Alertstripe type="advarsel">
                        <FormattedMessage id="step.tidsrom.søkerKunHelgedager.alert" />
                    </Alertstripe>
                </Box>
            )}

            {!søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <>
                    <Box margin="xl">
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.annenSamtidig.spm')}
                            name={SøknadFormField.harMedsøker}
                            validate={getYesOrNoValidator()}
                        />
                    </Box>

                    {harMedsøker === YesOrNo.YES && (
                        <Box margin="xl">
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                                name={SøknadFormField.samtidigHjemme}
                                validate={getYesOrNoValidator()}
                            />
                        </Box>
                    )}

                    <Box margin="xl">
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                            name={SøknadFormField.skalOppholdeSegIUtlandetIPerioden}
                            validate={getYesOrNoValidator()}
                        />
                    </Box>
                    {values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                        <Box margin="m">
                            <UtenlandsoppholdListAndDialog<SøknadFormField>
                                name={SøknadFormField.utenlandsoppholdIPerioden}
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
                            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                                <FormattedMessage id="steg.tidsrom.veileder.utenlandsopphold" />
                            </CounsellorPanel>
                        </Box>
                    )}

                    <Box margin="xl">
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                            name={SøknadFormField.skalTaUtFerieIPerioden}
                            validate={getYesOrNoValidator()}
                        />
                    </Box>
                    {values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                        <Box margin="m" padBottom="l">
                            <FerieuttakListAndDialog<SøknadFormField>
                                name={SøknadFormField.ferieuttakIPerioden}
                                minDate={periode.from}
                                maxDate={periode.to}
                                labels={{
                                    modalTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.modalTitle'),
                                    listTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.listTitle'),
                                    addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel'),
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
        </SøknadFormStep>
    );
};

export default TidsromStep;
