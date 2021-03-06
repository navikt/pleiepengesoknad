import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import Lenke from 'nav-frontend-lenker';
import Panel from 'nav-frontend-paneler';
import getLenker from '../../../../lenker';
import { AppFormField, Arbeidsform, PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import {
    getArbeidsformAnsattValidator,
    getJobberNormaltTimerValidator,
    validateFrilanserStartdato,
} from '../../../../validation/fieldValidations';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimer';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { erFrilanserISøknadsperiode } from '../../../../utils/frilanserUtils';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart = ({ formValues }: Props) => {
    const {
        frilans_jobberFortsattSomFrilans,
        harHattInntektSomFrilanser,
        frilans_startdato,
        frilans_arbeidsforhold,
        periodeFra,
        frilans_sluttdato,
    } = formValues;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.frilans_harHattInntektSomFrilanser}
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
            {harHattInntektSomFrilanser === YesOrNo.YES && (
                <>
                    <Box margin="l">
                        <Panel>
                            <Box>
                                <AppForm.DatePicker
                                    name={AppFormField.frilans_startdato}
                                    label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                    showYearSelector={true}
                                    maxDate={dateToday}
                                    validate={validateFrilanserStartdato}
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
                                        validate={getDateValidator({
                                            required: true,
                                            min: datepickerUtils.getDateFromDateString(frilans_startdato),
                                            max: dateToday,
                                        })}
                                    />
                                </FormBlock>
                            )}
                            {(frilans_jobberFortsattSomFrilans === YesOrNo.YES ||
                                erFrilanserISøknadsperiode(periodeFra, frilans_sluttdato)) && (
                                <FormBlock>
                                    <ArbeidsformOgTimer
                                        spørsmål={{
                                            arbeidsform: intlHelper(intl, `frilans.arbeidsforhold.arbeidsform.spm`),
                                            jobberNormaltTimer: (arbeidsform: Arbeidsform) =>
                                                intlHelper(intl, `snFrilanser.arbeidsforhold.iDag.${arbeidsform}.spm`),
                                        }}
                                        validator={{
                                            arbeidsform: getArbeidsformAnsattValidator(frilans_arbeidsforhold),
                                            jobberNormaltTimer: getJobberNormaltTimerValidator(
                                                frilans_arbeidsforhold,
                                                'frilans'
                                            ),
                                        }}
                                        arbeidsforhold={frilans_arbeidsforhold}
                                        parentFieldName={`${AppFormField.frilans_arbeidsforhold}`}
                                    />
                                </FormBlock>
                            )}
                        </Panel>
                    </Box>
                </>
            )}
        </>
    );
};

export default FrilansFormPart;
