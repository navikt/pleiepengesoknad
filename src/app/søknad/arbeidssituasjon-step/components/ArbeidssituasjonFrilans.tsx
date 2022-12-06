import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
// import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
// import { ISODateToDate } from '@navikt/sif-common-utils/lib';
// import dayjs from 'dayjs';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData, FrilansFormField, FrilansTyper } from '../../../types/FrilansFormData';
// import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { harFrilansoppdrag } from '../../../utils/frilanserUtils';
// import { getFrilanserSluttdatoValidator } from '../validation/frilansSluttdatoValidator';
import { getFrilanserStartdatoValidator } from '../validation/frilansStartdatoValidator';
import FrilansoppdragInfo from './info/FrilansoppdragInfo';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

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
    // const { erFortsattFrilanser, harHattInntektSomFrilanser, startdato, sluttdato, arbeidsforhold } = formValues;
    const {
        erFortsattFrilanser,
        harHattInntektSomFrilanser,
        arbeidsforhold,
        misterHonorar,
        frilansTyper: frilansType,
    } = formValues;
    const intl = useIntl();

    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);
    const frilansStyreverv = frilansType?.some((type) => type === FrilansTyper.STYREVERV);
    const ikkeVisNormalarbeidstidFrilansStyreverv =
        frilansType &&
        frilansType.length === 1 &&
        frilansType.some((type) => type === FrilansTyper.STYREVERV) &&
        misterHonorar !== YesOrNo.YES;
    const visNormalarbeidstidSpørsmål = () => {
        if (ikkeVisNormalarbeidstidFrilansStyreverv) {
            return false;
        }
        return frilansType && frilansType.length > 0;
    };
    // const erAktivFrilanserIPerioden = erFrilanserISøknadsperiode(søknadsperiode, formValues, frilansoppdrag);
    // const harGyldigStartdato = startdato ? ISODateToDate(startdato) : undefined;
    //const harGyldigSluttdato = sluttdato ? ISODateToDate(sluttdato) : undefined;
    /*const harBesvartSpørsmålOmFortsattFrilanser =
        erFortsattFrilanser === YesOrNo.YES || erFortsattFrilanser === YesOrNo.NO;

    const sluttetFørSøknadsperiode =
        erFortsattFrilanser === YesOrNo.NO &&
        harGyldigSluttdato &&
        dayjs(sluttdato).isBefore(søknadsperiode.from, 'day');

    /*const visSpørsmålOmArbeidsforhold =
        harGyldigStartdato &&
        harBesvartSpørsmålOmFortsattFrilanser &&
        sluttetFørSøknadsperiode === false &&
        erAktivFrilanserIPerioden;*/

    return (
        <div data-testid="arbeidssituasjonFrilanser">
            {søkerHarFrilansoppdrag && <FrilansoppdragInfo frilansoppdrag={frilansoppdrag} intl={intl} />}

            <Box margin="l">
                <ArbFriFormComponents.YesOrNoQuestion
                    name={FrilansFormField.harHattInntektSomFrilanser}
                    data-testid="er-frilanser"
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

            {harHattInntektSomFrilanser === YesOrNo.YES && (
                <Box margin="l">
                    <ConditionalResponsivePanel usePanelLayout={harHattInntektSomFrilanser === YesOrNo.YES}>
                        <Element tag="h2">
                            <FormattedMessage id="frilanser.info" />
                        </Element>
                        <FormBlock>
                            <ArbFriFormComponents.CheckboxGroup
                                legend={intlHelper(intl, 'frilanser.type.tittel')}
                                name={FrilansFormField.frilansTyper}
                                data-testid="frilansType"
                                defaultChecked={true}
                                checkboxes={[
                                    {
                                        label: intlHelper(intl, 'frilanser.type.FRILANS'),
                                        value: FrilansTyper.FRILANS,
                                        checked: frilansType?.some((type) => type === FrilansTyper.FRILANS),
                                    },
                                    {
                                        label: intlHelper(intl, 'frilanser.type.OMSORGSSTØNAD'),
                                        value: FrilansTyper.OMSORGSSTØNAD,
                                        checked: frilansType?.some((type) => type === FrilansTyper.OMSORGSSTØNAD),
                                    },
                                    {
                                        label: intlHelper(intl, 'frilanser.type.STYREVERV'),
                                        value: FrilansTyper.STYREVERV,
                                        checked: frilansType?.some((type) => type === FrilansTyper.STYREVERV),
                                    },
                                ]}
                            />
                        </FormBlock>
                        {frilansStyreverv && (
                            <>
                                <FormBlock>
                                    <ArbFriFormComponents.YesOrNoQuestion
                                        name={FrilansFormField.misterHonorar}
                                        data-testid="misterHonorar"
                                        legend={intlHelper(intl, 'frilanser.misterHonorar.tittle')}
                                        validate={getYesOrNoValidator()}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(intl, 'frilanser.misterHonorar.description.tittel')}>
                                                <FormattedMessage id={'frilanser.misterHonorar.description'} />
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {misterHonorar === YesOrNo.NO && (
                                    <Box margin="l">
                                        <AlertStripeInfo>
                                            <FormattedMessage id={'frilanser.misterHonorar.nei.info'} />
                                        </AlertStripeInfo>
                                    </Box>
                                )}
                            </>
                        )}
                        {visNormalarbeidstidSpørsmål() && (
                            <>
                                <FormBlock>
                                    <NormalarbeidstidSpørsmål
                                        arbeidsforholdFieldName={FrilansFormField.arbeidsforhold}
                                        arbeidsforhold={arbeidsforhold || {}}
                                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                        erAktivtArbeidsforhold={erFortsattFrilanser === YesOrNo.YES}
                                        brukKunSnittPerUke={true}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <ArbFriFormComponents.DatePicker
                                        name={FrilansFormField.startdato}
                                        label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                        showYearSelector={true}
                                        maxDate={søknadsdato}
                                        validate={getFrilanserStartdatoValidator(
                                            formValues,
                                            søknadsperiode,
                                            søknadsdato
                                        )}
                                        data-testid="er-frilanser-startdato"
                                    />
                                </FormBlock>
                            </>
                        )}
                    </ConditionalResponsivePanel>
                </Box>
            )}
        </div>
    );
};

export default ArbeidssituasjonFrilans;
