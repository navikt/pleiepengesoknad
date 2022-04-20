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
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData, FrilansFormField } from '../../../types/FrilansFormData';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { getFrilanserSluttdatoValidator } from '../validation/frilansSluttdatoValidator';
import { getFrilanserStartdatoValidator } from '../validation/frilansStartdatoValidator';
import FrilansoppdragInfo from './info/FrilansoppdragInfo';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';

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
    const { erFortsattFrilanser, harHattInntektSomFrilanser, startdato, sluttdato, arbeidsforhold } = formValues;
    const intl = useIntl();

    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);
    const erAktivFrilanserIPerioden = erFrilanserISøknadsperiode(søknadsperiode, formValues, frilansoppdrag);
    const harGyldigStartdato = startdato ? ISODateToDate(startdato) : undefined;
    const harGyldigSluttdato = sluttdato ? ISODateToDate(sluttdato) : undefined;
    const harBesvartSpørsmålOmFortsattFrilanser =
        erFortsattFrilanser === YesOrNo.YES || erFortsattFrilanser === YesOrNo.NO;

    const sluttetFørSøknadsperiode =
        erFortsattFrilanser === YesOrNo.NO &&
        harGyldigSluttdato &&
        dayjs(sluttdato).isBefore(søknadsperiode.from, 'day');

    const visSpørsmålOmArbeidsforhold =
        harGyldigStartdato &&
        harBesvartSpørsmålOmFortsattFrilanser &&
        sluttetFørSøknadsperiode === false &&
        erAktivFrilanserIPerioden;

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
                                name={FrilansFormField.erFortsattFrilanser}
                                legend={intlHelper(intl, 'frilanser.erFortsattFrilanser.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {erFortsattFrilanser === YesOrNo.NO && (
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
                            <FormBlock>
                                {/* <Box padBottom="m">
                                    <Ingress>Hvordan jobber du som frilanser til vanlig?</Ingress>
                                </Box>
                                <Box padBottom="xl">
                                    Vi trenger informasjon om hvordan du jobber som frilanser når du ikke har fravær på
                                    grunn av pleiepenger, slik at vi kan beregne riktig pleiepenger.
                                </Box> */}
                                <NormalarbeidstidSpørsmål
                                    arbeidsforholdFieldName={FrilansFormField.arbeidsforhold}
                                    arbeidsforhold={arbeidsforhold || {}}
                                    arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                    erAktivtArbeidsforhold={erFortsattFrilanser === YesOrNo.YES}
                                />
                            </FormBlock>
                        )}
                    </ConditionalResponsivePanel>
                </Box>
            )}
        </>
    );
};

export default ArbeidssituasjonFrilans;
