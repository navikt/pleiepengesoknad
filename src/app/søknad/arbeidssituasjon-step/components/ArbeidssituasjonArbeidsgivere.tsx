import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFormValues } from '../../../types/ArbeidsforholdFormValues';
import ArbeidssituasjonAnsatt from './ArbeidssituasjonAnsatt';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    ansatt_arbeidsforhold: ArbeidsforholdFormValues[];
    parentFieldName: string;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonArbeidsgivere: React.FunctionComponent<Props> = ({
    ansatt_arbeidsforhold,
    søknadsperiode,
    parentFieldName,
}) => {
    const intl = useIntl();
    return (
        <>
            <Box>
                <p>
                    {ansatt_arbeidsforhold.length > 0 && (
                        <FormattedMessage
                            id={'steg.arbeidssituasjon.veileder.medArbeidsgiver'}
                            values={{ antall: ansatt_arbeidsforhold.length }}
                        />
                    )}
                    {ansatt_arbeidsforhold.length === 0 && (
                        <FormattedMessage id="steg.arbeidssituasjon.veileder.ingenArbeidsgiverFunnet" />
                    )}
                </p>
                <ExpandableInfo
                    filledBackground={false}
                    title={intlHelper(intl, 'steg.arbeidssituasjon.veileder.manglerDetArbeidsgiver.tittel')}>
                    <>
                        <FormattedMessage id={'steg.arbeidssituasjon.veileder.manglerDetArbeidsgiver'} />
                    </>
                </ExpandableInfo>
            </Box>
            {ansatt_arbeidsforhold.length > 0 && (
                <>
                    {ansatt_arbeidsforhold.map((forhold, index) => (
                        <FormBlock key={forhold.arbeidsgiver.id}>
                            <ArbeidssituasjonAnsatt
                                arbeidsforhold={forhold}
                                parentFieldName={`${parentFieldName}.${index}`}
                                søknadsperiode={søknadsperiode}
                            />
                        </FormBlock>
                    ))}
                </>
            )}
        </>
    );
};

export default ArbeidssituasjonArbeidsgivere;
