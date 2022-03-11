import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import { Arbeidsgiver } from '../../../types';
import { ArbeidsforholdFormField } from '../../../types/Arbeidsforhold';
import { FrilansFormData, FrilansFormField } from '../../../types/FrilansFormData';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import FrilansoppdragInfo from './info/FrilansoppdragInfo';
import InfoJobberNormaltTimerFrilanser from './info/InfoJobberNormaltTimerFrilanser';
import { getFrilanserSluttdatoValidator } from './validation/frilansSluttdatoValidator';
import { getFrilanserStartdatoValidator } from './validation/frilansStartdatoValidator';
import { getJobberNormaltTimerValidator } from './validation/jobberNormaltTimerValidator';

const ArbFriFormComponents = getTypedFormComponents<FrilansFormField, FrilansFormData, ValidationError>();

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    parentFieldName: string;
    formValues: FrilansFormData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
    urlSkatteetaten: string;
}

const ArbeidssituasjonFrilans = ({
    formValues,
    søknadsperiode,
    søknadsdato,
    frilansoppdrag,
    urlSkatteetaten,
}: Props) => {
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

    const getArbeidsforholdFieldName = (fieldName: ArbeidsforholdFormField) =>
        `${FrilansFormField.arbeidsforhold}.${fieldName}` as any;

    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.FRILANSER'),
        jobber: intlHelper(intl, 'arbeidsforhold.part.jobber'),
    };

    return (
        <>
            {søkerHarFrilansoppdrag && <FrilansoppdragInfo frilansoppdrag={frilansoppdrag} />}
            {søkerHarFrilansoppdrag === false && (
                <Box margin="l">
                    <ArbFriFormComponents.YesOrNoQuestion
                        name={FrilansFormField.harHattInntektSomFrilanser}
                        legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                        validate={getYesOrNoValidator()}
                        description={
                            søkerHarFrilansoppdrag ? undefined : (
                                <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                                    <>
                                        {intlHelper(intl, 'frilanser.hjelpetekst')}{' '}
                                        <Lenke href={urlSkatteetaten} target="_blank">
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
                            <Ingress>
                                <FormattedMessage id="arbeidssituasjonFrilanser.frilanserPart.tittel" />
                            </Ingress>
                        </Box>
                    )}
                    <ConditionalResponsivePanel
                        usePanelLayout={harHattInntektSomFrilanser === YesOrNo.YES && søkerHarFrilansoppdrag === false}>
                        <ArbFriFormComponents.DatePicker
                            name={FrilansFormField.startdato}
                            label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                            showYearSelector={true}
                            maxDate={søknadsdato}
                            validate={getFrilanserStartdatoValidator(formValues, søknadsperiode, søknadsdato)}
                        />
                        <FormBlock>
                            <ArbFriFormComponents.YesOrNoQuestion
                                name={FrilansFormField.jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {jobberFortsattSomFrilans === YesOrNo.NO && (
                            <FormBlock>
                                <ArbFriFormComponents.DatePicker
                                    name={FrilansFormField.sluttdato}
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
                                    <ArbFriFormComponents.YesOrNoQuestion
                                        name={getArbeidsforholdFieldName(ArbeidsforholdFormField.harFraværIPeriode)}
                                        legend={intlHelper(intl, 'frilanser.harFraværIPerioden.spm')}
                                        validate={getYesOrNoValidator()}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <ArbFriFormComponents.NumberInput
                                        label={intlHelper(
                                            intl,
                                            jobberFortsattSomFrilans === YesOrNo.NO
                                                ? 'frilanser.jobberNormaltTimer.avsluttet.spm'
                                                : 'frilanser.jobberNormaltTimer.spm'
                                        )}
                                        name={getArbeidsforholdFieldName(ArbeidsforholdFormField.jobberNormaltTimer)}
                                        suffix={intlHelper(intl, `arbeidsforhold.timer.suffix`)}
                                        suffixStyle="text"
                                        description={<InfoJobberNormaltTimerFrilanser />}
                                        bredde="XS"
                                        validate={getJobberNormaltTimerValidator(intlValues)}
                                        value={arbeidsforhold ? arbeidsforhold.jobberNormaltTimer || '' : ''}
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
