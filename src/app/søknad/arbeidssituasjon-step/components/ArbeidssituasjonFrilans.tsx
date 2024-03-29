import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import {
    getCheckedValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import ConditionalResponsivePanel from '../../../components/conditional-responsive-panel/ConditionalResponsivePanel';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData, FrilansFormField, FrilansTyper } from '../../../types/FrilansFormData';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { getFrilanserStartdatoValidator } from '../validation/frilansStartdatoValidator';
import FrilansoppdragInfo from './info/FrilansoppdragInfo';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { StønadGodtgjørelseFormData, StønadGodtgjørelseFormField } from '../../../types/StønadGodtgjørelseFormData';
import {
    AppFieldValidationErrors,
    getstønadGodtgjørelseSluttdatoValidator,
    getstønadGodtgjørelseStartdatoValidator,
} from '../../../validation/fieldValidations';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getFrilanserSluttdatoValidator } from '../validation/frilansSluttdatoValidator';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';

const ArbFriFormComponents = getTypedFormComponents<FrilansFormField, FrilansFormData, ValidationError>();
const StønadGodtgjørelseFormComponents = getTypedFormComponents<
    StønadGodtgjørelseFormField,
    StønadGodtgjørelseFormData,
    ValidationError
>();

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    parentFieldName: string;
    formValues: FrilansFormData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
    stønadGodtgjørelse: StønadGodtgjørelseFormData;
}

const ArbeidssituasjonFrilans = ({
    formValues,
    søknadsperiode,
    søknadsdato,
    frilansoppdrag,
    stønadGodtgjørelse,
}: Props) => {
    const {
        harHattInntektSomFrilanser,
        arbeidsforhold,
        misterHonorarStyreverv,
        frilansTyper = [],
        erFortsattFrilanser,
        startdato,
        sluttdato,
    } = formValues;
    const intl = useIntl();

    const søkerHarFrilansoppdrag = harFrilansoppdrag(frilansoppdrag);
    const mottarHonorarForStyreverv = frilansTyper?.some((type) => type === FrilansTyper.STYREVERV);

    const erAktivFrilanserIPerioden = erFrilanserISøknadsperiode(søknadsperiode, formValues);
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

    const getFrilansTypeTekst = () => {
        if (frilansTyper === undefined || frilansTyper.length === 0) {
            return '';
        }
        const erFrilanser = frilansTyper.some((type) => type === FrilansTyper.FRILANS);
        const erVerv =
            frilansTyper.some((type) => type === FrilansTyper.STYREVERV) && misterHonorarStyreverv === YesOrNo.YES;

        if (erFrilanser && !erVerv) {
            return 'frilans';
        }
        if (erVerv && !erFrilanser) {
            return 'verv';
        }
        if (erVerv && erFrilanser) {
            return 'frilansVerv';
        }
        return '';
    };

    return (
        <div data-testid="arbeidssituasjonFrilanser">
            {søkerHarFrilansoppdrag && <FrilansoppdragInfo frilansoppdrag={frilansoppdrag} />}
            <FormBlock>
                <StønadGodtgjørelseFormComponents.YesOrNoQuestion
                    name={StønadGodtgjørelseFormField.mottarStønadGodtgjørelse}
                    data-testid="mottar-stønadGodtgjørelse"
                    legend={intlHelper(intl, 'steg.arbeidssituasjon.stønadGodtgjørelse.mottarStønadGodtgjørelse.spm')}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo
                            title={intlHelper(
                                intl,
                                'steg.arbeidssituasjon.stønadGodtgjørelse.mottarStønadGodtgjørelse.spm.description.tittel'
                            )}>
                            <FormattedMessage id="steg.arbeidssituasjon.stønadGodtgjørelse.mottarStønadGodtgjørelse.spm.description" />
                        </ExpandableInfo>
                    }
                />
                {stønadGodtgjørelse && stønadGodtgjørelse.mottarStønadGodtgjørelse === YesOrNo.YES && (
                    <Box margin="l">
                        <ConditionalResponsivePanel usePanelLayout={true}>
                            <Box>
                                <StønadGodtgjørelseFormComponents.RadioGroup
                                    name={StønadGodtgjørelseFormField.mottarStønadGodtgjørelseIHelePeroden}
                                    legend={intlHelper(
                                        intl,
                                        'steg.arbeidssituasjon.stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden.spm'
                                    )}
                                    radios={[
                                        {
                                            label: 'Ja',
                                            value: YesOrNo.YES,
                                            'data-testid': 'mottar-stønadGodtgjørelse-i-hele-peroden_yes',
                                        },
                                        {
                                            label: 'Nei',
                                            value: YesOrNo.NO,
                                            'data-testid': 'mottar-stønadGodtgjørelse-i-hele-peroden_no',
                                        },
                                    ]}
                                    validate={getRequiredFieldValidator()}
                                    checked={stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden}
                                />
                            </Box>
                            {stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden === YesOrNo.NO && (
                                <>
                                    <Box margin="l">
                                        <StønadGodtgjørelseFormComponents.RadioGroup
                                            name={StønadGodtgjørelseFormField.starterUndeveis}
                                            legend={intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.stønadGodtgjørelse.starterUndeveis.spm'
                                            )}
                                            radios={[
                                                {
                                                    label: 'Ja',
                                                    value: YesOrNo.YES,
                                                    'data-testid': 'stønadGodtgjørelse-starter-undeveis_yes',
                                                },
                                                {
                                                    label: 'Nei',
                                                    value: YesOrNo.NO,
                                                    'data-testid': 'stønadGodtgjørelse-starter-undeveis_no',
                                                },
                                            ]}
                                            validate={getRequiredFieldValidator()}
                                            checked={stønadGodtgjørelse.starterUndeveis}
                                        />
                                        {stønadGodtgjørelse.starterUndeveis === YesOrNo.YES && (
                                            <Box margin="m">
                                                <StønadGodtgjørelseFormComponents.DatePicker
                                                    name={StønadGodtgjørelseFormField.startdato}
                                                    label={intlHelper(
                                                        intl,
                                                        'steg.arbeidssituasjon.stønadGodtgjørelse.starterUndeveis.startdato'
                                                    )}
                                                    showYearSelector={true}
                                                    minDate={søknadsperiode.from}
                                                    maxDate={søknadsperiode.to}
                                                    data-testid="stønadGodtgjørelse-startdato"
                                                    validate={getstønadGodtgjørelseStartdatoValidator(
                                                        stønadGodtgjørelse,
                                                        søknadsperiode
                                                    )}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                    <Box margin="l">
                                        <StønadGodtgjørelseFormComponents.RadioGroup
                                            name={StønadGodtgjørelseFormField.slutterUnderveis}
                                            legend={intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.stønadGodtgjørelse.slutterUndeveis.spm'
                                            )}
                                            radios={[
                                                {
                                                    label: 'Ja',
                                                    value: YesOrNo.YES,
                                                    'data-testid': 'stønadGodtgjørelse-slutter-undeveis_yes',
                                                },
                                                {
                                                    label: 'Nei',
                                                    value: YesOrNo.NO,
                                                    'data-testid': 'stønadGodtgjørelse-slutter-undeveis_no',
                                                },
                                            ]}
                                            validate={(value) => {
                                                if (
                                                    value === YesOrNo.NO &&
                                                    stønadGodtgjørelse.starterUndeveis === YesOrNo.NO
                                                ) {
                                                    return AppFieldValidationErrors.starter_slutter_undeveis_nei;
                                                }

                                                return getRequiredFieldValidator()(value);
                                            }}
                                            checked={stønadGodtgjørelse.slutterUnderveis}
                                        />

                                        {stønadGodtgjørelse.slutterUnderveis === YesOrNo.YES && (
                                            <Box margin="m">
                                                <StønadGodtgjørelseFormComponents.DatePicker
                                                    name={StønadGodtgjørelseFormField.sluttdato}
                                                    label={intlHelper(
                                                        intl,
                                                        'steg.arbeidssituasjon.stønadGodtgjørelse.starterUndeveis.sluttdato'
                                                    )}
                                                    showYearSelector={true}
                                                    minDate={søknadsperiode.from}
                                                    maxDate={søknadsperiode.to}
                                                    data-testid="stønadGodtgjørelse-sluttdato"
                                                    validate={getstønadGodtgjørelseSluttdatoValidator(
                                                        stønadGodtgjørelse,
                                                        søknadsperiode
                                                    )}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            )}
                        </ConditionalResponsivePanel>
                    </Box>
                )}
            </FormBlock>
            <FormBlock>
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
                                    </>
                                )}
                                {!søkerHarFrilansoppdrag && (
                                    <>
                                        <p>
                                            <FormattedMessage id="frilanser.hjelpetekst.1" />
                                        </p>
                                    </>
                                )}
                            </>
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {harHattInntektSomFrilanser === YesOrNo.YES && (
                <Box margin="l">
                    <ConditionalResponsivePanel usePanelLayout={harHattInntektSomFrilanser === YesOrNo.YES}>
                        <ArbFriFormComponents.CheckboxGroup
                            legend={intlHelper(intl, 'frilanser.type.tittel')}
                            name={FrilansFormField.frilansTyper}
                            data-testid="frilans-typer"
                            defaultChecked={true}
                            validate={getCheckedValidator()}
                            checkboxes={[
                                {
                                    label: intlHelper(intl, 'frilanser.type.FRILANS'),
                                    value: FrilansTyper.FRILANS,
                                    checked: frilansTyper?.some((type) => type === FrilansTyper.FRILANS),
                                    'data-testid': 'frilans-typer_frilans',
                                },

                                {
                                    label: intlHelper(intl, 'frilanser.type.STYREVERV'),
                                    value: FrilansTyper.STYREVERV,
                                    checked: frilansTyper?.some((type) => type === FrilansTyper.STYREVERV),
                                    'data-testid': 'frilans-typer_styreverv',
                                },
                            ]}
                        />

                        {mottarHonorarForStyreverv && (
                            <>
                                <FormBlock>
                                    <ArbFriFormComponents.RadioGroup
                                        name={FrilansFormField.misterHonorarStyreverv}
                                        data-testid="misterHonorarStyreverv"
                                        legend={intlHelper(intl, 'frilanser.misterHonorarStyreverv.tittle')}
                                        validate={getYesOrNoValidator()}
                                        radios={[
                                            {
                                                label: 'Ja',
                                                value: YesOrNo.YES,
                                                'data-testid': 'mister-honorarStyreverv_yes',
                                            },
                                            {
                                                label: 'Nei',
                                                value: YesOrNo.NO,
                                                'data-testid': 'mister-honorarStyreverv_no',
                                            },
                                        ]}
                                        checked={misterHonorarStyreverv}
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
                                    <ArbFriFormComponents.DatePicker
                                        name={FrilansFormField.startdato}
                                        label={intlHelper(intl, `frilanser.nårStartet.${getFrilansTypeTekst()}.spm`)}
                                        showYearSelector={true}
                                        maxDate={søknadsdato}
                                        validate={(value) => {
                                            const error = getFrilanserStartdatoValidator(
                                                formValues,
                                                søknadsperiode,
                                                søknadsdato
                                            )(value);

                                            return error
                                                ? {
                                                      key: `${error}`,
                                                      values: {
                                                          frilansTyper: intlHelper(
                                                              intl,
                                                              `validation.frilans.startdato.${getFrilansTypeTekst()}`
                                                          ),
                                                      },
                                                  }
                                                : undefined;
                                        }}
                                        data-testid="er-frilanser-startdato"
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <ArbFriFormComponents.RadioGroup
                                        name={FrilansFormField.erFortsattFrilanser}
                                        data-testid="erFortsattFrilanser"
                                        legend={intlHelper(
                                            intl,
                                            `frilanser.erFortsattFrilanser.${getFrilansTypeTekst()}.spm`
                                        )}
                                        validate={(value) => {
                                            const error = getYesOrNoValidator()(value);

                                            return error
                                                ? {
                                                      key: `${error}`,
                                                      values: {
                                                          frilansTyper: intlHelper(
                                                              intl,
                                                              `validation.frilans.erFortsattFrilanser.${getFrilansTypeTekst()}`
                                                          ),
                                                      },
                                                  }
                                                : undefined;
                                        }}
                                        radios={[
                                            {
                                                label: 'Ja',
                                                value: YesOrNo.YES,
                                                'data-testid': 'er-fortsatt-frilanser_yes',
                                            },
                                            {
                                                label: 'Nei',
                                                value: YesOrNo.NO,
                                                'data-testid': 'er-fortsatt-frilanser_no',
                                            },
                                        ]}
                                        checked={erFortsattFrilanser}
                                    />
                                </FormBlock>
                                {erFortsattFrilanser === YesOrNo.NO && (
                                    <FormBlock>
                                        <ArbFriFormComponents.DatePicker
                                            name={FrilansFormField.sluttdato}
                                            label={intlHelper(
                                                intl,
                                                `frilanser.nårSluttet.${getFrilansTypeTekst()}.spm`
                                            )}
                                            showYearSelector={true}
                                            minDate={datepickerUtils.getDateFromDateString(startdato)}
                                            maxDate={søknadsdato}
                                            validate={(value) => {
                                                const error = getFrilanserSluttdatoValidator(
                                                    formValues,
                                                    søknadsperiode,
                                                    søknadsdato
                                                )(value);

                                                return error
                                                    ? {
                                                          key: `${error}`,
                                                          values: {
                                                              frilansTyper: intlHelper(
                                                                  intl,
                                                                  `validation.frilans.sluttdato.${getFrilansTypeTekst()}`
                                                              ),
                                                          },
                                                      }
                                                    : undefined;
                                            }}
                                            data-testid="er-frilanser-sluttdato"
                                        />
                                    </FormBlock>
                                )}
                                {visSpørsmålOmArbeidsforhold && (
                                    <FormBlock>
                                        <NormalarbeidstidSpørsmål
                                            arbeidsforholdFieldName={FrilansFormField.arbeidsforhold}
                                            arbeidsforhold={arbeidsforhold || {}}
                                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                            erAktivtArbeidsforhold={erFortsattFrilanser === YesOrNo.YES}
                                            brukKunSnittPerUke={true}
                                            frilansTyper={frilansTyper}
                                            misterHonorarStyreverv={misterHonorarStyreverv}
                                            mottarStønadGodtgjørelse={
                                                stønadGodtgjørelse.mottarStønadGodtgjørelse === YesOrNo.YES
                                            }
                                        />
                                    </FormBlock>
                                )}
                            </>
                        )}
                    </ConditionalResponsivePanel>
                </Box>
            )}

            {frilansoppdrag.length > 0 &&
                harHattInntektSomFrilanser === YesOrNo.NO &&
                stønadGodtgjørelse.mottarStønadGodtgjørelse === YesOrNo.NO && (
                    <Box margin="l">
                        <AlertStripeInfo>
                            <FormattedMessage id={'frilanser.ingenFrilans.info'} />
                        </AlertStripeInfo>
                    </Box>
                )}
        </div>
    );
};

export default ArbeidssituasjonFrilans;
