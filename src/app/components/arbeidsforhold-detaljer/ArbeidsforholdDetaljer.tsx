import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    AppFormField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    Arbeidsforhold,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeSvar,
    Arbeidsform,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdDetaljerPart from './RedusertArbeidsforholdDetaljerPart';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ArbeidsformInfo from './info/arbeidsforholdInfo';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const getTimerTekst = (value: string, intl: IntlShape): string => {
    const timer = getNumberFromNumberInputValue(value);
    if (timer) {
        return intlHelper(intl, 'timer', {
            timer,
        });
    }
    return intlHelper(intl, 'timer.ikkeTall', {
        timer: value,
    });
};

const ArbeidsforholdDetaljer = ({ arbeidsforhold, index }: Props) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) =>
        `${AppFormField.arbeidsforhold}.${index}.${field}` as AppFormField;
    return (
        <>
            <FormBlock margin="none">
                <AppForm.RadioPanelGroup
                    legend={intlHelper(intl, 'arbeidsforhold.arbeidsform.spm', {
                        arbeidsforhold: arbeidsforhold.navn,
                    })}
                    name={getFieldName(ArbeidsforholdField.arbeidsform)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.fast'),
                            value: Arbeidsform.fast,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus'),
                            value: Arbeidsform.turnus,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.varierende'),
                            value: Arbeidsform.varierende,
                        },
                    ]}
                    validate={(value) => {
                        return getRequiredFieldValidator()(value)
                            ? {
                                  key: 'validation.arbeidsforhold.arbeidsform.yesOrNoIsUnanswered',
                                  values: { navn: arbeidsforhold.navn },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />
            </FormBlock>
            {arbeidsforhold.arbeidsform !== undefined && (
                <>
                    <FormBlock>
                        <AppForm.NumberInput
                            name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                            suffix={intlHelper(
                                intl,
                                `arbeidsforhold.arbeidsform.${arbeidsforhold.arbeidsform}.timer.suffix`
                            )}
                            suffixStyle="text"
                            description={
                                <div style={{ width: '100%' }}>
                                    {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                        <Box margin="m">
                                            <ArbeidsformInfo arbeidsform={Arbeidsform.fast} />
                                        </Box>
                                    )}
                                    {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                        <Box margin="m">
                                            <ArbeidsformInfo arbeidsform={Arbeidsform.turnus} />
                                        </Box>
                                    )}
                                    {arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                        <>
                                            <Box margin="m">
                                                <ArbeidsformInfo arbeidsform={Arbeidsform.varierende} />
                                            </Box>
                                        </>
                                    )}
                                </div>
                            }
                            bredde="XS"
                            label={intlHelper(intl, `arbeidsforhold.iDag.${arbeidsforhold.arbeidsform}.spm`, {
                                arbeidsforhold: arbeidsforhold.navn,
                            })}
                            validate={(value) => {
                                const error = getNumberValidator({
                                    required: true,
                                    min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                    max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                })(value);
                                if (error) {
                                    return {
                                        key: `validation.arbeidsforhold.jobberNormaltTimer.${arbeidsforhold.arbeidsform}.${error}`,
                                        values: {
                                            navn: arbeidsforhold.navn,
                                            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                        },
                                        keepKeyUnaltered: true,
                                    };
                                }
                                return error;
                            }}
                            value={arbeidsforhold.jobberNormaltTimer || ''}
                        />
                    </FormBlock>
                    {hasValue(arbeidsforhold.jobberNormaltTimer) && (
                        <FormBlock>
                            <AppForm.RadioPanelGroup
                                legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm', {
                                    navn: arbeidsforhold.navn,
                                })}
                                description={
                                    <ExpandableInfo title="Hva betyr dette?">
                                        For å kunne beregne hvor mye pleiepenger du kan få trenger vi å vite om du skal
                                        jobbe i samme periode som du skal ha pleiepenger. Velg det som passer best i din
                                        situasjon.
                                    </ExpandableInfo>
                                }
                                name={getFieldName(ArbeidsforholdField.skalJobbe)}
                                radios={[
                                    {
                                        label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                        value: ArbeidsforholdSkalJobbeSvar.ja,
                                    },
                                    {
                                        label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                        value: ArbeidsforholdSkalJobbeSvar.nei,
                                    },
                                    {
                                        label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                        value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                    },
                                ]}
                                validate={(values) =>
                                    getRequiredFieldValidator()(values)
                                        ? {
                                              key: 'validation.arbeidsforhold.skalJobbe',
                                              values: { navn: arbeidsforhold.navn },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined
                                }
                            />
                            {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke && (
                                <Box margin="l">
                                    <AlertStripe type="info">
                                        <p>
                                            <FormattedMessage id="arbeidsforhold.vetIkke.info.1" />
                                        </p>
                                        <p>
                                            <FormattedMessage id="arbeidsforhold.vetIkke.info.2" />
                                        </p>
                                    </AlertStripe>
                                </Box>
                            )}
                        </FormBlock>
                    )}
                </>
            )}
            {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.ja &&
                arbeidsforhold.jobberNormaltTimer &&
                hasValue(arbeidsforhold.jobberNormaltTimer) && (
                    <>
                        <FormBlock>
                            <AppForm.RadioPanelGroup
                                name={getFieldName(ArbeidsforholdField.skalJobbeHvorMye)}
                                legend={intlHelper(intl, 'arbeidsforhold.jobbeHvorMye.spm', {
                                    navn: arbeidsforhold.navn,
                                    timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                })}
                                radios={[
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                                        label: intlHelper(intl, 'arbeidsforhold.jobbeHvorMye.somVanlig', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                                        label: intlHelper(intl, 'arbeidsforhold.jobbeHvorMye.redusert', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                ]}
                                validate={(values) =>
                                    getRequiredFieldValidator()(values)
                                        ? {
                                              key: 'validation.arbeidsforhold.jobbeHvorMye',
                                              values: { navn: arbeidsforhold.navn },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined
                                }
                            />
                        </FormBlock>
                        {arbeidsforhold.skalJobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert && (
                            <FormBlock>
                                <RedusertArbeidsforholdDetaljerPart
                                    arbeidsforhold={arbeidsforhold}
                                    getFieldName={getFieldName}
                                />
                            </FormBlock>
                        )}
                    </>
                )}
        </>
    );
};

export default ArbeidsforholdDetaljer;
