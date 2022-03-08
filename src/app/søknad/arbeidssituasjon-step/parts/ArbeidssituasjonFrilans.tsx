import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import Lenke from 'nav-frontend-lenker';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import getLenker from '../../../lenker';
import { ArbeidsforholdField } from '../../../types/Arbeidsforhold';
import { Arbeidsgiver, FrilansFormDataPart, SøknadFormField } from '../../../types/SøknadFormData';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { getJobberNormaltTimerValidator } from '../../../validation/validateArbeidFields';
import { getFrilanserSluttdatoValidator, getFrilanserStartdatoValidator } from '../../../validation/validateFrilanser';
import SøknadFormComponents from '../../SøknadFormComponents';
import FrilansoppdragInfo from './FrilansoppdragInfo';
import InfoJobberNormaltTimerFrilanser from './InfoJobberNormaltTimerFrilanser';
import JobberNormaltTimerSpørsmål from './JobberNormaltTimerSpørsmål';
import { Ingress } from 'nav-frontend-typografi';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    formValues: FrilansFormDataPart;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const ArbeidssituasjonFrilans = ({ formValues, søknadsperiode, søknadsdato, frilansoppdrag }: Props) => {
    const { jobberFortsattSomFrilans, harHattInntektSomFrilanser, startdato, sluttdato, arbeidsforhold } = formValues;
    const intl = useIntl();

    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);
    const erAktivFrilanserIPerioden = erFrilanserISøknadsperiode(søknadsperiode, formValues, frilansoppdrag);
    const harGyldigStartdato = startdato ? ISODateToDate(startdato) : undefined;
    const harGyldigSluttdato = sluttdato ? ISODateToDate(sluttdato) : undefined;
    const harBesvartSpørsmålOmFortsattFrilanser =
        jobberFortsattSomFrilans === YesOrNo.YES || jobberFortsattSomFrilans === YesOrNo.NO;

    const sluttetFørSøknadsperiode =
        jobberFortsattSomFrilans === YesOrNo.NO &&
        harGyldigSluttdato &&
        dayjs(sluttdato).isBefore(søknadsperiode.from, 'day');

    const visSpørsmålOmArbeidsforhold =
        harGyldigStartdato &&
        harBesvartSpørsmålOmFortsattFrilanser &&
        sluttetFørSøknadsperiode === false &&
        erAktivFrilanserIPerioden;

    const getArbeidsforholdFieldName = (fieldName: ArbeidsforholdField) =>
        `${SøknadFormField.frilans_arbeidsforhold}.${fieldName}` as any;

    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.FRILANSER'),
        jobber: intlHelper(intl, 'arbeidsforhold.part.jobber'),
    };

    return (
        <>
            {søkerHarFrilansoppdrag && <FrilansoppdragInfo frilansoppdrag={frilansoppdrag} />}
            {søkerHarFrilansoppdrag === false && (
                <Box margin="l">
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.frilans_harHattInntektSomFrilanser}
                        legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                        validate={getYesOrNoValidator()}
                        description={
                            søkerHarFrilansoppdrag ? undefined : (
                                <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                                    <>
                                        {intlHelper(intl, 'frilanser.hjelpetekst')}{' '}
                                        <Lenke href={getLenker(intl.locale).skatteetaten} target="_blank">
                                            <FormattedMessage id="frilanser.hjelpetekst.skatteetatenLenke" />
                                        </Lenke>
                                    </>
                                </ExpandableInfo>
                            )
                        }
                    />
                </Box>
            )}
            {(harHattInntektSomFrilanser === YesOrNo.YES || søkerHarFrilansoppdrag) && (
                <Box margin="l">
                    {søkerHarFrilansoppdrag && (
                        <Box padBottom="l">
                            <Ingress>Om deg som frilanser</Ingress>
                        </Box>
                    )}
                    <ConditionalResponsivePanel
                        usePanelLayout={harHattInntektSomFrilanser === YesOrNo.YES && søkerHarFrilansoppdrag === false}>
                        <SøknadFormComponents.DatePicker
                            name={SøknadFormField.frilans_startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            maxDate={søknadsdato}
                            validate={getFrilanserStartdatoValidator(formValues, søknadsperiode, søknadsdato)}
                        />
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {jobberFortsattSomFrilans === YesOrNo.NO && (
                            <FormBlock>
                                <SøknadFormComponents.DatePicker
                                    name={SøknadFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(startdato)}
                                    maxDate={søknadsdato}
                                    validate={getFrilanserSluttdatoValidator(
                                        formValues,
                                        søknadsperiode,
                                        søknadsdato,
                                        søkerHarFrilansoppdrag
                                    )}
                                />
                            </FormBlock>
                        )}
                        {visSpørsmålOmArbeidsforhold && (
                            <>
                                <FormBlock>
                                    <JobberNormaltTimerSpørsmål
                                        spørsmål={intlHelper(
                                            intl,
                                            jobberFortsattSomFrilans === YesOrNo.NO
                                                ? 'frilanser.jobberNormaltTimer.avsluttet.spm'
                                                : 'frilanser.jobberNormaltTimer.spm'
                                        )}
                                        validator={getJobberNormaltTimerValidator(intlValues)}
                                        arbeidsforhold={arbeidsforhold}
                                        fieldName={getArbeidsforholdFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                        description={<InfoJobberNormaltTimerFrilanser />}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <SøknadFormComponents.YesOrNoQuestion
                                        name={getArbeidsforholdFieldName(ArbeidsforholdField.harFraværIPeriode)}
                                        legend={intlHelper(intl, 'frilanser.harFraværIPerioden.spm')}
                                        validate={getYesOrNoValidator()}
                                    />
                                </FormBlock>
                            </>
                        )}
                    </ConditionalResponsivePanel>
                </Box>
            )}
        </>
    );
};

export default ArbeidssituasjonFrilans;
