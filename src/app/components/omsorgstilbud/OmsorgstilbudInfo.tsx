import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudCalendar from './OmsorgstilbudCalendar';
import { OmsorgstilbudDag } from './types';
import { FormattedMessage } from 'react-intl';

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
    const måned = omsorgsdager.length > 0 ? omsorgsdager[0].dato : fraDato;

    return (
        <>
            {tittelRenderer ? (
                tittelRenderer(fraDato, tilDato, omsorgsdager)
            ) : (
                <Undertittel tag="h3">
                    <FormattedMessage
                        id="omsorgstilbud.ukeOgÅr"
                        values={{ ukeOgÅr: dayjs(måned).format('MMMM YYYY') }}
                    />
                </Undertittel>
            )}

            <Box margin="s">
                {omsorgsdager.length === 0 ? (
                    <p>
                        <FormattedMessage id="omsorgstilbud.ingenDagerRegistrert" />
                    </p>
                ) : (
                    <OmsorgstilbudCalendar
                        måned={måned}
                        fraDato={fraDato}
                        tilDato={tilDato}
                        omsorgsdager={omsorgsdager}
                        brukEtikettForInnhold={brukEtikettForTid}
                        visSomListe={false}
                        skjulTommeDagerIListe={skjulTommeDagerIListe}
                    />
                )}
            </Box>
        </>
    );
};
export default OmsorgstilbudInfo;
