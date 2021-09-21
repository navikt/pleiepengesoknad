import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    ArbeidsforholdSkalJobbeSvar,
} from '../../../types/PleiepengesøknadFormData';
import {
    getArbeidsforholdSkalJobbeHvorMyeValidator,
    getArbeidsforholdSkalJobbeValidator,
    validateFasteArbeidstimerIUke,
} from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import ArbeidstimerUke from './ArbeidstimerUke';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
    periode: DateRange;
    erHistorisk: boolean;
}

export interface ArbeidsforholdISøknadsperiodeIntlValues {
    hvor: string;
    arbeidsform: string;
    fra: string;
    timer: string;
    skalJobbe: string;
}

const ArbeidIPeriodeFormPart = ({ arbeidsforhold, parentFieldName, erHistorisk }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidIPeriodeField) =>
        `${parentFieldName}.${erHistorisk ? 'historisk' : 'planlagt'}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}${spørsmål}.spm`, {});

    const arbeidIPeriode = erHistorisk ? arbeidsforhold?.historisk : arbeidsforhold?.planlagt;
    const intlValues: any = {};
    const { jobber, jobberRedusert, erLiktHverDag } = arbeidIPeriode || {};

    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    name={getFieldName(ArbeidIPeriodeField.jobber)}
                    legend={getSpørsmål(ArbeidIPeriodeField.jobber)}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'validation.arbeidIPeriode.skalJobbe.info.tittel')}>
                            <FormattedMessage id="validation.arbeidIPeriode.skalJobbe.info.tekst" />
                        </ExpandableInfo>
                    }
                    validate={getArbeidsforholdSkalJobbeValidator(intlValues)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.ja'),
                            value: ArbeidsforholdSkalJobbeSvar.ja,
                        },
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.nei'),
                            value: ArbeidsforholdSkalJobbeSvar.nei,
                        },
                        ...(erHistorisk === false
                            ? [
                                  {
                                      label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.vetIkke'),
                                      value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                  },
                              ]
                            : []),
                    ]}
                />
            </FormBlock>
            {jobber && (
                <FormBlock>
                    <AppForm.YesOrNoQuestion
                        name={getFieldName(ArbeidIPeriodeField.jobberRedusert)}
                        legend={getSpørsmål(ArbeidIPeriodeField.jobberRedusert)}
                        validate={getArbeidsforholdSkalJobbeHvorMyeValidator(intlValues)}
                    />
                </FormBlock>
            )}
            {jobberRedusert === YesOrNo.YES && (
                <FormBlock>
                    <AppForm.YesOrNoQuestion
                        name={getFieldName(ArbeidIPeriodeField.erLiktHverDag)}
                        legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverDag)}
                        useTwoColumns={false}
                        labels={{
                            yes: intlHelper(
                                intl,
                                `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.erLikt`
                            ),
                            no: intlHelper(
                                intl,
                                `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.varierer`
                            ),
                        }}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}
            {erLiktHverDag === YesOrNo.YES && (
                <FormBlock>
                    <AppForm.InputGroup
                        legend={'Oppgi timene og minuttene du skal arbeide i uken'}
                        validate={() => validateFasteArbeidstimerIUke(arbeidIPeriode)}
                        name={'fasteDager_gruppe' as any}>
                        <ArbeidstimerUke name={getFieldName(ArbeidIPeriodeField.fasteDager)} />
                    </AppForm.InputGroup>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeFormPart;
