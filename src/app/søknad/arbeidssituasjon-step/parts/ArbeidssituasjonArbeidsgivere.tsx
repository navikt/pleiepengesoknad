import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-utils/lib';
import { Arbeidsforhold } from '../../../types/Arbeidsforhold';
import ArbeidssituasjonAnsatt from './ArbeidssituasjonAnsatt';

interface Props {
    ansatt_arbeidsforhold: Arbeidsforhold[];
    parentFieldName: string;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonArbeidsgivere: React.FunctionComponent<Props> = ({
    ansatt_arbeidsforhold,
    søknadsperiode,
    parentFieldName,
}) => (
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
            <p>
                <FormattedMessage id={'steg.arbeidssituasjon.veileder.manglerDetArbeidsgiver'} />
            </p>
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

export default ArbeidssituasjonArbeidsgivere;
