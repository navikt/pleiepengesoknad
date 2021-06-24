import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import {
    AppFormField,
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import RedusertArbeidsforholdDetaljerPart from './RedusertArbeidsforholdDetaljerPart';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsatt;
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
            <FormBlock>
                <AppForm.RadioPanelGroup
                    legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm', {
                        navn: arbeidsforhold.navn,
                    })}
                    description={
                        <ExpandableInfo title="Hva betyr dette?">
                            For å kunne beregne hvor mye pleiepenger du kan få trenger vi å vite om du skal jobbe i
                            samme periode som du skal ha pleiepenger. Velg det som passer best i din situasjon.
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
            </FormBlock>
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
