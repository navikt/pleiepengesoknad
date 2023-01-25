import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData, FrilansFormField, FrilansTyper } from '../../../types/FrilansFormData';
import { harFrilansoppdrag } from '../../../utils/frilanserUtils';
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
}

const ArbeidssituasjonFrilans = ({ formValues, søknadsperiode, søknadsdato, frilansoppdrag }: Props) => {
    const { harHattInntektSomFrilanser, arbeidsforhold, misterHonorarStyreverv, frilansTyper = [] } = formValues;
    const intl = useIntl();

    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);
    const mottarHonorarForStyreverv = frilansTyper?.some((type) => type === FrilansTyper.STYREVERV);

    const visNormalarbeidstidSpørsmål = () => {
        if (!frilansTyper || frilansTyper.length === 0) {
            return false;
        }
        if (frilansTyper.length === 1 && mottarHonorarForStyreverv && misterHonorarStyreverv === YesOrNo.YES) {
            return true;
        }
        if (!mottarHonorarForStyreverv) {
            return true;
        } else if (mottarHonorarForStyreverv && frilansTyper.length > 1 && misterHonorarStyreverv !== undefined) {
            return true;
        }

        return false;
    };

    const getFrilansStartDatoTekst = () => {
        if (frilansTyper === undefined || frilansTyper.length === 0) {
            return '';
        }
        const erFrilanser = frilansTyper.some((type) => type === FrilansTyper.FRILANS);
        const erVerv =
            frilansTyper.some((type) => type === FrilansTyper.STYREVERV) && misterHonorarStyreverv === YesOrNo.YES;

        if (erFrilanser && !erVerv) {
            return 'frilanser.nårStartet.frilans.spm';
        }
        if (erVerv && !erFrilanser) {
            return 'frilanser.nårStartet.verv.spm';
        }
        if (erVerv && erFrilanser) {
            return 'frilanser.nårStartet.frilansVerv.spm';
        }
        return '';
    };

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
                        <ExpandableInfo
                            title={
                                søkerHarFrilansoppdrag
                                    ? intlHelper(intl, 'frilanser.harDuHattInntekt.hvaBetyr.spm')
                                    : intlHelper(intl, 'frilanser.hjelpetekst.spm')
                            }>
                            <>
                                {søkerHarFrilansoppdrag && (
                                    <>
                                        <p>
                                            <FormattedMessage id="frilanser.harDuHattInntekt.hvaBetyr.info.1" />
                                        </p>

                                        <p>
                                            <FormattedMessage id="frilanser.harDuHattInntekt.hvaBetyr.info.2" />
                                        </p>
                                    </>
                                )}
                                {!søkerHarFrilansoppdrag && (
                                    <>
                                        <p>
                                            <FormattedMessage id="frilanser.hjelpetekst.1" />
                                        </p>

                                        <p>
                                            <FormattedMessage id="frilanser.hjelpetekst.2" />
                                        </p>
                                    </>
                                )}
                            </>
                        </ExpandableInfo>
                    }
                />
            </Box>

            {harHattInntektSomFrilanser === YesOrNo.YES && (
                <Box margin="l">
                    <ConditionalResponsivePanel usePanelLayout={harHattInntektSomFrilanser === YesOrNo.YES}>
                        <ArbFriFormComponents.CheckboxGroup
                            legend={intlHelper(intl, 'frilanser.type.tittel')}
                            name={FrilansFormField.frilansTyper}
                            data-testid="frilansType"
                            defaultChecked={true}
                            validate={getCheckedValidator()}
                            checkboxes={[
                                {
                                    label: intlHelper(intl, 'frilanser.type.FRILANS'),
                                    value: FrilansTyper.FRILANS,
                                    checked: frilansTyper?.some((type) => type === FrilansTyper.FRILANS),
                                },

                                {
                                    label: intlHelper(intl, 'frilanser.type.STYREVERV'),
                                    value: FrilansTyper.STYREVERV,
                                    checked: frilansTyper?.some((type) => type === FrilansTyper.STYREVERV),
                                },
                            ]}
                        />

                        {mottarHonorarForStyreverv && (
                            <>
                                <FormBlock>
                                    <ArbFriFormComponents.YesOrNoQuestion
                                        name={FrilansFormField.misterHonorarStyreverv}
                                        data-testid="misterHonorarStyreverv"
                                        legend={intlHelper(intl, 'frilanser.misterHonorarStyreverv.tittle')}
                                        validate={getYesOrNoValidator()}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'frilanser.misterHonorarStyreverv.description.tittel'
                                                )}>
                                                <FormattedMessage id={'frilanser.misterHonorarStyreverv.description'} />
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {misterHonorarStyreverv === YesOrNo.NO && (
                                    <Box margin="l">
                                        <AlertStripeInfo>
                                            <FormattedMessage id={'frilanser.misterHonorarStyreverv.nei.info'} />
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
                                        erAktivtArbeidsforhold={true}
                                        brukKunSnittPerUke={true}
                                        frilansTyper={frilansTyper}
                                        misterHonorarStyreverv={misterHonorarStyreverv}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <ArbFriFormComponents.DatePicker
                                        name={FrilansFormField.startdato}
                                        label={intlHelper(intl, getFrilansStartDatoTekst())}
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
