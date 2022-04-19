import { TidFasteDager } from '@navikt/sif-common-pleiepenger/lib';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NormalarbeidstidApiData } from '../../../types/SøknadApiData';

interface Props {
    erAnsatt: boolean;
    normalarbeidstidApiData: NormalarbeidstidApiData;
}

const NormalarbeidstidSummary: React.FunctionComponent<Props> = ({ erAnsatt, normalarbeidstidApiData }) => {
    if (normalarbeidstidApiData.erLiktHverUke) {
        return (
            <>
                <FormattedMessage
                    id={
                        erAnsatt
                            ? 'oppsummering.arbeidssituasjon.fasteDager'
                            : 'oppsummering.arbeidssituasjon.avsluttet.fasteDager'
                    }
                />
                <TidFasteDager fasteDager={normalarbeidstidApiData.timerFasteDager} />
            </>
        );
    }
    return (
        <>
            <FormattedMessage
                id={erAnsatt ? `oppsummering.arbeidssituasjon.tid` : `oppsummering.arbeidssituasjon.avsluttet.tid`}
                values={{
                    timer: normalarbeidstidApiData.timerPerUkeISnitt,
                }}
            />
        </>
    );
};

export default NormalarbeidstidSummary;
