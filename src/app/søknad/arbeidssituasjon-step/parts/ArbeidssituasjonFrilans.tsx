import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { erFrilanserIPeriode } from '../../../utils/frilanserUtils';
import { getJobberNormaltTimerValidator } from '../../../validation/validateArbeidFields';
import { getFrilanserSluttdatoValidator, getFrilanserStartdatoValidator } from '../../../validation/validateFrilanser';
import SøknadFormComponents from '../../SøknadFormComponents';
import TimerFormPart from './TimerFormPart';

interface Props {
    formValues: SøknadFormData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const ArbeidssituasjonFrilans = ({ formValues, søknadsperiode, søknadsdato }: Props) => {
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
    };

    return (
        <>
            <Box margin="l">
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.frilans_harHattInntektSomFrilanser}
                    legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
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
                            <SøknadFormComponents.DatePicker
                                name={SøknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={søknadsdato}
                                validate={getFrilanserStartdatoValidator(formValues, søknadsdato)}
                            />
                        </Box>
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {frilans_jobberFortsattSomFrilans === YesOrNo.NO && (
                            <FormBlock>
                                <SøknadFormComponents.DatePicker
                                    name={SøknadFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                    maxDate={søknadsdato}
                                    validate={getFrilanserSluttdatoValidator(formValues, søknadsdato)}
                                />
                            </FormBlock>
                        )}
                        {(frilans_jobberFortsattSomFrilans === YesOrNo.YES ||
                            (frilans_jobberFortsattSomFrilans === YesOrNo.NO &&
                                erFrilanserIPeriode(søknadsperiode, formValues))) && (
                            <FormBlock>
                                <TimerFormPart
                                    arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                    spørsmål={{
                                        jobberNormaltTimer: () =>
                                            intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? `frilanser.arbeidsforhold.avsluttet.spm`
                                                    : `frilanser.arbeidsforhold.spm`
                                            ),
                                    }}
                                    validator={{
                                        jobberNormaltTimer: getJobberNormaltTimerValidator(intlValues),
                                    }}
                                    arbeidsforhold={frilans_arbeidsforhold}
                                    parentFieldName={`${SøknadFormField.frilans_arbeidsforhold}`}
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
