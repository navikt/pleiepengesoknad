import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../../lenker';
import { Arbeidsform } from '../../../../types';
import { AppFormField, PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import { getArbeidsformValidator, getJobberNormaltTimerValidator } from '../../../../validation/validateArbeidFields';
import {
    getFrilanserSluttdatoValidator,
    getFrilanserStartdatoValidator,
} from '../../../../validation/validateFrilanser';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimerFormPart';

interface Props {
    formValues: PleiepengesøknadFormData;
    søknadsperiode: DateRange;
    søkerKunHistoriskPeriode: boolean;
}

const ArbeidssituasjonFrilans = ({ formValues, søkerKunHistoriskPeriode }: Props) => {
    const {
        frilans_jobberFortsattSomFrilans,
        frilans_harHattInntektSomFrilanser,
        frilans_startdato,
        frilans_arbeidsforhold,
    } = formValues;
    const intl = useIntl();

    const erAvsluttet = frilans_jobberFortsattSomFrilans === YesOrNo.NO;
    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.FRILANSER'),
        jobber: erAvsluttet
            ? intlHelper(intl, 'arbeidsforhold.part.jobbet')
            : intlHelper(intl, 'arbeidsforhold.part.jobber'),
        arbeidsform: frilans_arbeidsforhold?.arbeidsform
            ? intlHelper(intl, `arbeidsforhold.part.arbeidsform.${frilans_arbeidsforhold.arbeidsform}`)
            : undefined,
    };

    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.frilans_harHattInntektSomFrilanser}
                    legend={intlHelper(
                        intl,
                        søkerKunHistoriskPeriode
                            ? 'frilanser.harDuHattInntekt.historisk.spm'
                            : 'frilanser.harDuHattInntekt.spm'
                    )}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                            <>
                                {intlHelper(intl, 'frilanser.hjelpetekst')}{' '}
                                <Lenke href={getLenker(intl.locale).skatteetaten} target="_blank">
                                    <FormattedMessage id="frilanser.hjelpetekst.skatteetatenLenke" />
                                </Lenke>
                            </>
                        </ExpandableInfo>
                    }
                />
            </Box>
            {frilans_harHattInntektSomFrilanser === YesOrNo.YES && (
                <Box margin="l">
                    <ResponsivePanel>
                        <Box>
                            <AppForm.DatePicker
                                name={AppFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={getFrilanserStartdatoValidator(formValues)}
                            />
                        </Box>
                        <FormBlock>
                            <AppForm.YesOrNoQuestion
                                name={AppFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {frilans_jobberFortsattSomFrilans === YesOrNo.NO && (
                            <FormBlock>
                                <AppForm.DatePicker
                                    name={AppFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                    maxDate={dateToday}
                                    validate={getFrilanserSluttdatoValidator(formValues)}
                                />
                            </FormBlock>
                        )}
                        {frilans_jobberFortsattSomFrilans === YesOrNo.YES && (
                            <FormBlock>
                                <ArbeidsformOgTimer
                                    spørsmål={{
                                        arbeidsform: erAvsluttet
                                            ? intlHelper(intl, `frilans.arbeidsforhold.avsluttet.arbeidsform.spm`)
                                            : intlHelper(intl, `frilans.arbeidsforhold.arbeidsform.spm`),
                                        jobberNormaltTimer: (arbeidsform: Arbeidsform) =>
                                            intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? `snFrilanser.arbeidsforhold.avsluttet.${arbeidsform}.spm`
                                                    : `snFrilanser.arbeidsforhold.${arbeidsform}.spm`
                                            ),
                                    }}
                                    validator={{
                                        arbeidsform: getArbeidsformValidator(intlValues),
                                        jobberNormaltTimer: getJobberNormaltTimerValidator(intlValues),
                                    }}
                                    arbeidsforhold={frilans_arbeidsforhold}
                                    parentFieldName={`${AppFormField.frilans_arbeidsforhold}`}
                                />
                            </FormBlock>
                        )}
                    </ResponsivePanel>
                </Box>
            )}
        </>
    );
};

export default ArbeidssituasjonFrilans;
