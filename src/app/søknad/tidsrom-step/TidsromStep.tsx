import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import { date1YearAgo, date1YearFromNow, date3YearsAgo, DateRange } from '@navikt/sif-common-utils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik-ds/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik-ds/lib/validation';
import FerieuttakListAndDialog from '@navikt/sif-common-forms-ds/lib/forms/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '@navikt/sif-common-forms-ds/lib/forms/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms-ds/lib/forms/utenlandsopphold/types';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common-forms-ds/lib/forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { useFormikContext } from 'formik';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import { søkerKunFortid, søkerKunFremtid } from '../../utils/søknadsperiodeUtils';
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
import ExpandableInfo from '@navikt/sif-common-core-ds/lib/components/expandable-info/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-formik-ds/lib';
import { Alert } from '@navikt/ds-react';

dayjs.extend(minMax);

const cleanupTidsromStep = (values: SøknadFormValues, søknadsperiode: DateRange): SøknadFormValues => {
    const cleanedValues = { ...values };

    if (cleanedValues.omsorgstilbud && søkerKunFortid(søknadsperiode)) {
        cleanedValues.omsorgstilbud.erIOmsorgstilbudFremtid = undefined;
        cleanedValues.omsorgstilbud.erLiktHverUke = undefined;
    }
    if (cleanedValues.omsorgstilbud && søkerKunFremtid(søknadsperiode)) {
        cleanedValues.omsorgstilbud.erIOmsorgstilbudFortid = undefined;
        cleanedValues.omsorgstilbud.erLiktHverUke = undefined;
    }
    return cleanedValues;
};

const TidsromStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const søkerdata = React.useContext(SøkerdataContext);

    const barnetSøknadenGjelder = values.barnetSøknadenGjelder
        ? søkerdata?.barn.find((barn) => barn.aktørId === values.barnetSøknadenGjelder)
        : undefined;

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
        values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES &&
        values.utenlandsoppholdIPerioden &&
        harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning(values.utenlandsoppholdIPerioden);

    return (
        <SøknadFormStep
            id={StepID.TIDSROM}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupTidsromStep(values, periode)}
            showSubmitButton={!søkerKunHelgedager(values.periodeFra, values.periodeTil)}>
            <SøknadFormComponents.DateRangePicker
                legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.info.tittel')}>
                        <p>
                            <FormattedMessage id="steg.tidsrom.hvilketTidsrom.info.1" />
                        </p>
                        <p>
                            <strong>
                                <FormattedMessage id="steg.tidsrom.hvilketTidsrom.info.2" />
                            </strong>
                            <br />
                            <FormattedMessage id="steg.tidsrom.hvilketTidsrom.info.3" />
                        </p>
                    </ExpandableInfo>
                }
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
                    dayPickerProps: { defaultMonth: periodeFra ? new Date(periodeFra) : undefined },
                }}
                disableWeekend={false}
                fullScreenOnMobile={true}
            />
            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Block padBottom="xl">
                    <Alert variant="warning">
                        <FormattedMessage id="step.tidsrom.søkerKunHelgedager.alert" />
                    </Alert>
                </Block>
            )}

            {!søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <>
                    <Block margin="xl">
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                            name={SøknadFormField.skalOppholdeSegIUtlandetIPerioden}
                            validate={getYesOrNoValidator()}
                            data-testid="er-iUtlandetIPerioden"
                        />
                    </Block>
                    {values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                        <Block margin="m">
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
                        </Block>
                    )}
                    {visInfoOmUtenlandsopphold && (
                        <Block margin="l" padBottom="l">
                            <SifGuidePanel compact={true}>
                                <FormattedMessage id="steg.tidsrom.veileder.utenlandsopphold" />
                            </SifGuidePanel>
                        </Block>
                    )}

                    <Block margin="xl">
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                            name={SøknadFormField.skalTaUtFerieIPerioden}
                            validate={getYesOrNoValidator()}
                            data-testid="er-ferieuttakIPerioden"
                        />
                    </Block>
                    {values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                        <Block margin="m" padBottom="l">
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
                        </Block>
                    )}
                </>
            )}
        </SøknadFormStep>
    );
};

export default TidsromStep;
