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
import getLenker from '../../../lenker';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFrilanserStartdato } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart = ({ formValues }: Props) => {
    const { frilans_jobberFortsattSomFrilans, harHattInntektSomFrilanser, frilans_startdato } = formValues;
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
                            <Box margin="xl">
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.frilans_jobberFortsattSomFrilans}
                                    legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                    validate={getYesOrNoValidator()}
                                />
                            </Box>
                            {frilans_jobberFortsattSomFrilans === YesOrNo.NO && (
                                <Box margin="xl">
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
                                </Box>
                            )}
                        </Panel>
                    </Box>
                </>
            )}
        </>
    );
};

export default FrilansFormPart;
