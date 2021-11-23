import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidIPeriode, ArbeidIPeriodeField } from '../../types/PleiepengesøknadFormData';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../validation/validateArbeidFields';
import AppForm from '../app-form/AppForm';
import TidFasteDagerInput from '../tid-faste-dager-input/TidFasteDagerInput';
import { ArbeidIPeriodeIntlValues } from './ArbeidIPeriodeSpørsmål';
import ArbeidstidKalenderInput from './ArbeidstidKalenderInput';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    visSpørsmålOmLiktHverUke: boolean;
    erHistorisk: boolean;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeidIPeriode?: ArbeidIPeriode;
    erLiktHverUke?: YesOrNo;
    getFieldName: (field: ArbeidIPeriodeField) => any;
    getSpørsmål: (spørsmål: ArbeidIPeriodeField) => any;
}

const ArbeidIPeriodenUtvidet: React.FunctionComponent<Props> = ({
    arbeidIPeriode,
    visSpørsmålOmLiktHverUke,
    erHistorisk,
    intlValues,
    erLiktHverUke,
    søknadsdato,
    periode,
    getFieldName,
    getSpørsmål,
}) => {
    const intl = useIntl();
    return (
        <>
            {visSpørsmålOmLiktHverUke && (
                <>
                    <FormBlock>
                        <AppForm.YesOrNoQuestion
                            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
                            legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverUke)}
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
                            validate={getArbeidErLiktHverUkeValidator(intlValues)}
                        />
                    </FormBlock>
                    {erLiktHverUke === YesOrNo.YES && (
                        <FormBlock margin="xl">
                            <AppForm.InputGroup
                                legend={intlHelper(
                                    intl,
                                    erHistorisk
                                        ? 'arbeidIPeriode.historisk.ukedager.tittel'
                                        : 'arbeidIPeriode.planlagt.ukedager.tittel',
                                    intlValues
                                )}
                                validate={() => validateFasteArbeidstimerIUke(arbeidIPeriode, intlValues)}
                                name={'fasteDager_gruppe' as any}
                                description={
                                    <ExpandableInfo title={intlHelper(intl, 'arbeidIPeriode.ukedager.info.tittel')}>
                                        <FormattedMessage
                                            id={
                                                erHistorisk
                                                    ? 'arbeidIPeriode.ukedager.historisk.info.tekst.1'
                                                    : 'arbeidIPeriode.ukedager.planlagt.info.tekst.1'
                                            }
                                            tagName="p"
                                        />
                                        <FormattedMessage
                                            id={
                                                erHistorisk
                                                    ? 'arbeidIPeriode.ukedager.historisk.info.tekst.2'
                                                    : 'arbeidIPeriode.ukedager.planlagt.info.tekst.2'
                                            }
                                            tagName="p"
                                        />
                                    </ExpandableInfo>
                                }>
                                <TidFasteDagerInput
                                    name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                    validator={getArbeidstimerFastDagValidator}
                                />
                            </AppForm.InputGroup>
                        </FormBlock>
                    )}
                </>
            )}
            {(erLiktHverUke === YesOrNo.NO || visSpørsmålOmLiktHverUke === false) && (
                <FormBlock>
                    <ArbeidstidKalenderInput
                        periode={periode}
                        tidMedArbeid={arbeidIPeriode?.enkeltdager}
                        intlValues={intlValues}
                        enkeltdagerFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                        søknadsdato={søknadsdato}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodenUtvidet;
