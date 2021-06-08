import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudCalendar from './OmsorgstilbudCalendar';
import { OmsorgstilbudDag } from './types';

interface Props {
    omsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    brukEtikettForTid?: boolean;
    skjulTommeDagerIListe?: boolean;
    tittelRenderer?: (fraDato: Date, tilDato: Date, omsorgsdager: OmsorgstilbudDag[]) => React.ReactNode;
}

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({
    omsorgsdager,
    fraDato,
    tilDato,
    brukEtikettForTid,
    tittelRenderer,
    skjulTommeDagerIListe,
}) => {
    if (omsorgsdager.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgsdager[0].dato;
    return (
        <>
            {tittelRenderer ? (
                tittelRenderer(fraDato, tilDato, omsorgsdager)
            ) : (
                <Undertittel tag="h3">Omsorgstilbud {dayjs(måned).format('MMM YYYY')}</Undertittel>
            )}

            <Box margin="s">
                <OmsorgstilbudCalendar
                    måned={måned}
                    fraDato={fraDato}
                    tilDato={tilDato}
                    omsorgsdager={omsorgsdager}
                    brukEtikettForInnhold={brukEtikettForTid}
                    visSomListe={false}
                    skjulTommeDagerIListe={skjulTommeDagerIListe}
                />
            </Box>
        </>
    );
};
export default OmsorgstilbudInfo;
