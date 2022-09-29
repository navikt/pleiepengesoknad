import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidsforholdType,
    getArbeidstimerFastDagValidator,
    TidFasteUkedagerInput,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormField,
    ArbeidsforholdFrilanserFormData,
    ArbeidsforholdSelvstendigFormData,
} from '../../../../types/ArbeidsforholdFormData';
import { getArbeidsforholdIntlValues } from '../../utils/arbeidsforholdIntlValues';
import InfoArbeiderLiktHverUke from '../info/InfoArbeiderLiktHverUke';
import InfoArbeiderNormaltTimerIUken from '../info/InfoArbeiderNormaltTimerIUken';
import { getArbeiderNormaltTimerIUkenValidator } from '../../validation/arbeiderNormaltTimerIUkenValidator';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { Ingress } from 'nav-frontend-typografi';
import { Duration, durationToDecimalDuration } from '@navikt/sif-common-utils/lib';

interface Props {
    arbeidsforholdFieldName: string;
    arbeidsstedNavn?: string;
    arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData | ArbeidsforholdSelvstendigFormData;
    arbeidsforholdType: ArbeidsforholdType;
    erAktivtArbeidsforhold: boolean;
    brukKunSnittPerUke: boolean;
    timerPerUkeISnittForrigeSøknad?: Duration;
}

const FormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormData, ValidationError>();

const NormalarbeidstidSpørsmål: React.FunctionComponent<Props> = ({
    arbeidsforholdFieldName,
    arbeidsforhold,
    arbeidsforholdType,
    erAktivtArbeidsforhold,
    arbeidsstedNavn,
    brukKunSnittPerUke,
    timerPerUkeISnittForrigeSøknad,
}) => {
    const intl = useIntl();
    const getFieldName = (fieldName: ArbeidsforholdFormField) => `${arbeidsforholdFieldName}.${fieldName}` as any;
    const intlValues = getArbeidsforholdIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            type: arbeidsforholdType,
        },
    });

    const { arbeiderFastHelg, arbeiderHeltid, erEndretSidenForrigeSøknad } = arbeidsforhold.normalarbeidstid || {};

    const renderTimerPerUkeSpørsmål = (spørOmTimerISnitt: boolean) => {
        return (
            <FormComponents.NumberInput
                label={intlHelper(
                    intl,
                    erAktivtArbeidsforhold === false
                        ? spørOmTimerISnitt
                            ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.avsluttet.spm`
                            : 'arbeidsforhold.arbeiderNormaltTimerPerUke.avsluttet.spm'
                        : spørOmTimerISnitt
                        ? `arbeidsforhold.arbeiderNormaltTimerPerUke.snitt.spm`
                        : `arbeidsforhold.arbeiderNormaltTimerPerUke.spm`,
                    intlValues
                )}
                data-testid={`${getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}`}
                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_TimerPerUke)}
                description={
                    spørOmTimerISnitt ? (
                        <InfoArbeiderNormaltTimerIUken arbeidsforholdType={arbeidsforholdType} />
                    ) : undefined
                }
                suffix={intlHelper(intl, `arbeidsforhold.timerPerUke.suffix`)}
                suffixStyle="text"
                bredde="XS"
                validate={getArbeiderNormaltTimerIUkenValidator({
                    ...intlValues,
                    jobber: erAktivtArbeidsforhold ? 'jobber' : 'jobbet',
                })}
                value={arbeidsforhold.normalarbeidstid ? arbeidsforhold.normalarbeidstid.timerPerUke || '' : ''}
            />
        );
    };

    if (brukKunSnittPerUke) {
        return <FormBlock>{renderTimerPerUkeSpørsmål(true)}</FormBlock>;
    }

    const shouldRenderTimerPerUkeSpørsmål = (): boolean => {
        if (erEndretSidenForrigeSøknad === YesOrNo.NO) {
            return false;
        }
        if (arbeiderHeltid === YesOrNo.NO || (arbeiderHeltid === YesOrNo.YES && arbeiderFastHelg === YesOrNo.YES)) {
            return true;
        }
        if (
            arbeiderHeltid === YesOrNo.YES &&
            arbeiderFastHelg === YesOrNo.NO &&
            arbeidsforhold.normalarbeidstid?.erLikeMangeTimerHverUke === YesOrNo.NO
        ) {
            return true;
        }
        if (
            arbeidsforhold.normalarbeidstid?.erLikeMangeTimerHverUke === YesOrNo.YES &&
            arbeidsforhold.normalarbeidstid.erFasteUkedager === YesOrNo.NO
        ) {
            return true;
        }
        return false;
    };

    return (
        <>
            <FormBlock paddingBottom="l" margin="none">
                <Ingress tag="h4">
                    <FormattedMessage id="arbeidsforhold.normalarbeidstid.intro.tittel" />
                </Ingress>
                <p>
                    <FormattedMessage id="arbeidsforhold.normalarbeidstid.intro.tekst" />
                </p>
            </FormBlock>

            {timerPerUkeISnittForrigeSøknad !== undefined && (
                <>
                    <FormComponents.YesOrNoQuestion
                        name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_erEndretSidenForrigeSøknad)}
                        legend={`I forrige søknad oppgav du at du jobbet ${durationToDecimalDuration(
                            timerPerUkeISnittForrigeSøknad
                        )} timer i snitt per uke hos ${arbeidsstedNavn}. Har dette endret seg siden sist du søkte?`}
                        data-testid="normalarbeidstidErLikForrigeSøknad"
                        validate={(value: any) => {
                            const error = getRequiredFieldValidator()(value);
                            return error
                                ? {
                                      key: 'validation.arbeidsforhold.erEndretSidenForrigeSøknad',
                                      values: intlValues,
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                        useTwoColumns={true}
                    />
                </>
            )}
            {(timerPerUkeISnittForrigeSøknad === undefined ||
                (timerPerUkeISnittForrigeSøknad !== undefined && erEndretSidenForrigeSøknad === YesOrNo.YES)) && (
                <>
                    <FormBlock margin={timerPerUkeISnittForrigeSøknad ? undefined : 'none'}>
                        <FormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_arbeiderHeltid)}
                            legend={intlHelper(intl, `arbeidsforhold.arbeiderHeltid.spm`, intlValues)}
                            description={intlHelper(intl, `arbeidsforhold.arbeiderHeltid.description`, intlValues)}
                            data-testid="jobber-heltid"
                            validate={(value: any) => {
                                const error = getRequiredFieldValidator()(value);
                                return error
                                    ? {
                                          key: 'validation.arbeidsforhold.arbeiderHeltid',
                                          values: intlValues,
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined;
                            }}
                            useTwoColumns={true}
                        />
                    </FormBlock>
                    {arbeiderHeltid === YesOrNo.YES && (
                        <FormBlock>
                            <FormComponents.YesOrNoQuestion
                                name={getFieldName(ArbeidsforholdFormField.normalarbeidstid_arbeiderFastHelg)}
                                legend={intlHelper(intl, `arbeidsforhold.arbeiderFastHelg.spm`, intlValues)}
                                description={
                                    <ExpandableInfo
                                        title={intlHelper(intl, 'arbeidsforhold.arbeiderFastHelg.info.tittel')}>
                                        <FormattedMessage id="arbeidsforhold.arbeiderFastHelg.info.tekst" />
                                    </ExpandableInfo>
                                }
                                data-testid="jobber-fast-helg"
                                validate={(value: any) => {
                                    const error = getRequiredFieldValidator()(value);
                                    return error
                                        ? {
                                              key: 'validation.arbeidsforhold.arbeiderFastHelg',
                                              values: intlValues,
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                                useTwoColumns={true}
                            />
                        </FormBlock>
                    )}
                    {arbeiderHeltid === YesOrNo.YES && arbeiderFastHelg === YesOrNo.NO && (
                        <>
                            <FormBlock>
                                <FormComponents.YesOrNoQuestion
                                    name={getFieldName(
                                        ArbeidsforholdFormField.normalarbeidstid_erLikeMangeTimerHverUke
                                    )}
                                    legend={intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.spm`, intlValues)}
                                    description={<InfoArbeiderLiktHverUke arbeidsforholdType={arbeidsforholdType} />}
                                    data-testid="like-mange-timer-hver-uke"
                                    validate={(value: any) => {
                                        const error = getRequiredFieldValidator()(value);
                                        return error
                                            ? {
                                                  key: 'validation.arbeidsforhold.erLikeMangeTimerHverUke',
                                                  values: intlValues,
                                                  keepKeyUnaltered: true,
                                              }
                                            : undefined;
                                    }}
                                    useTwoColumns={true}
                                    labels={{
                                        yes: intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.ja`),
                                        no: intlHelper(intl, `arbeidsforhold.erLikeMangeTimerHverUke.nei`),
                                    }}
                                />
                            </FormBlock>
                            {arbeidsforhold.normalarbeidstid?.erLikeMangeTimerHverUke === YesOrNo.YES && (
                                <>
                                    <FormBlock>
                                        <FormComponents.YesOrNoQuestion
                                            name={getFieldName(
                                                ArbeidsforholdFormField.normalarbeidstid_erFasteUkedager
                                            )}
                                            legend={intlHelper(intl, `arbeidsforhold.erFasteUkedager.spm`, intlValues)}
                                            labels={{
                                                yes: intlHelper(intl, `arbeidsforhold.erFasteUkedager.ja`),
                                                no: intlHelper(intl, `arbeidsforhold.erFasteUkedager.nei`),
                                            }}
                                            data-testid="er-faste-ukedager"
                                            validate={(value) => {
                                                const error = getYesOrNoValidator()(value);
                                                return error
                                                    ? {
                                                          key: 'validation.arbeidsforhold.erFasteUkedager.yesOrNoIsUnanswered',
                                                          values: { ...intlValues },
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            useTwoColumns={true}
                                        />
                                    </FormBlock>
                                    {arbeidsforhold.normalarbeidstid.erFasteUkedager === YesOrNo.YES && (
                                        <FormBlock>
                                            <FormComponents.InputGroup
                                                legend={
                                                    erAktivtArbeidsforhold
                                                        ? intlHelper(intl, 'arbeidsforhold.ukedager.tittel', intlValues)
                                                        : intlHelper(
                                                              intl,
                                                              'arbeidsforhold.ukedager.avsluttet.tittel',
                                                              intlValues
                                                          )
                                                }
                                                validate={() => {
                                                    const error = validateFasteArbeidstimerIUke(
                                                        arbeidsforhold.normalarbeidstid?.timerFasteUkedager
                                                    );
                                                    return error
                                                        ? {
                                                              key: `validation.arbeidsforhold.erFasteUkedager.${error.key}`,
                                                              values: {
                                                                  ...intlValues,
                                                                  jobber: erAktivtArbeidsforhold ? 'jobber' : 'jobbet',
                                                              },
                                                              keepKeyUnaltered: true,
                                                          }
                                                        : undefined;
                                                }}
                                                name={'erFasteUkedager.gruppe' as any}>
                                                <TidFasteUkedagerInput
                                                    name={getFieldName(
                                                        ArbeidsforholdFormField.normalarbeidstid_timerFasteUkedager
                                                    )}
                                                    data-testid="tid-faste-ukedager"
                                                    validateDag={(dag, value) => {
                                                        const error = getArbeidstimerFastDagValidator()(value);
                                                        return error
                                                            ? {
                                                                  key: `validation.arbeidsforhold.fastDag.tid.${error}`,
                                                                  keepKeyUnaltered: true,
                                                                  values: { ...intlValues, dag },
                                                              }
                                                            : undefined;
                                                    }}
                                                />
                                            </FormComponents.InputGroup>
                                        </FormBlock>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {shouldRenderTimerPerUkeSpørsmål() && <FormBlock>{renderTimerPerUkeSpørsmål(true)}</FormBlock>}
        </>
    );
};

export default NormalarbeidstidSpørsmål;
