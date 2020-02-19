import { Virksomhet } from '@navikt/sif-common/lib/common/forms/virksomhet/types';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { VirksomhetApiData } from '../../types/PleiepengesøknadApiData';

export const mapVirksomhetToVirksomhetApiData = (virksomhet: Virksomhet): VirksomhetApiData => {
    const registrertINorge = virksomhet.registrertINorge === YesOrNo.YES;
    const harRegnskapsfører = virksomhet.harRegnskapsfører === YesOrNo.YES;

    const data: VirksomhetApiData = {
        naringstype: [...virksomhet.næringstyper],
        navn_pa_virksomheten: virksomhet.navnPåVirksomheten,
        registrert_i_norge: registrertINorge,
        ...(registrertINorge
            ? {
                  organisasjonsnummer: virksomhet.organisasjonsnummer
              }
            : {
                  registrert_i_land: virksomhet.registrertILand
              }),
        fra_og_med: formatDateToApiFormat(virksomhet.fom),
        til_og_med:
            virksomhet.erPågående || virksomhet.tom === undefined ? null : formatDateToApiFormat(virksomhet.tom),
        er_pagaende: virksomhet.erPågående,
        naringsinntekt: virksomhet.næringsinntekt,
        har_regnskapsforer: harRegnskapsfører
    };

    if (virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår) {
        const harHatt = virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES;
        const { endretNæringsinntektInformasjon } = virksomhet;
        if (harHatt && endretNæringsinntektInformasjon) {
            data.varig_endring = {
                dato: formatDateToApiFormat(endretNæringsinntektInformasjon.dato),
                forklaring: endretNæringsinntektInformasjon.forklaring,
                inntekt_etter_endring: endretNæringsinntektInformasjon.næringsinntektEtterEndring
            };
        }
    }

    if (virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene) {
        const harBlittAktiv = virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES;
        data.har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene = harBlittAktiv;
        if (harBlittAktiv && virksomhet.oppstartsdato) {
            data.yrkesaktiv_siste_tre_ferdigliknede_arene = {
                oppstartsdato: formatDateToApiFormat(virksomhet.oppstartsdato)
            };
        }
    }

    if (harRegnskapsfører) {
        data.regnskapsforer = {
            navn: virksomhet.regnskapsfører_navn!,
            telefon: virksomhet.regnskapsfører_telefon!,
            er_nar_venn_familie: virksomhet.regnskapsfører_erNærVennEllerFamilie === YesOrNo.YES
        };
    }

    if (!harRegnskapsfører) {
        data.har_revisor = virksomhet.harRevisor === YesOrNo.YES;
        if (virksomhet.harRevisor === YesOrNo.YES) {
            data.revisor = {
                navn: virksomhet.revisor_navn!,
                telefon: virksomhet.revisor_telefon!,
                er_nar_venn_familie: virksomhet.revisor_erNærVennEllerFamilie === YesOrNo.YES,
                kan_innhente_opplysninger:
                    virksomhet.revisor_erNærVennEllerFamilie === YesOrNo.YES
                        ? virksomhet.kanInnhenteOpplsyningerFraRevisor === YesOrNo.YES
                        : undefined
            };
        }
    }

    return data;
};
