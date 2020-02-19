import { Virksomhet } from '@navikt/sif-common/lib/common/forms/virksomhet/types';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { VirksomhetApiData } from '../../types/PleiepengesøknadApiData';

export const mapVirksomhetToVirksomhetApiData = (virksomhet: Virksomhet): VirksomhetApiData => {
    const registrertINorge = virksomhet.registrertINorge === YesOrNo.YES;
    const harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene =
        virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES;
    const harRegnskapsfører = virksomhet.harRegnskapsfører === YesOrNo.YES;
    const harRevisor = virksomhet.harRevisor === YesOrNo.YES;
    const hattVarigEndringAvNæringsinntektSiste4Kalenderår =
        virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES;
    const { endretNæringsinntektInformasjon } = virksomhet;

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
        til_og_med: virksomhet.erPågående ? null : formatDateToApiFormat(virksomhet.tom),
        har_varig_endring_av_inntekt_siste_4_kalenderar: hattVarigEndringAvNæringsinntektSiste4Kalenderår,
        varig_endring:
            hattVarigEndringAvNæringsinntektSiste4Kalenderår && endretNæringsinntektInformasjon
                ? {
                      dato: formatDateToApiFormat(endretNæringsinntektInformasjon.dato),
                      inntekt_etter_endring: endretNæringsinntektInformasjon.næringsinntektEtterEndring,
                      forklaring: endretNæringsinntektInformasjon.forklaring
                  }
                : undefined,
        er_pagaende: virksomhet.erPågående,
        naringsinntekt: virksomhet.næringsinntekt,
        har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene: harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene,
        yrkesaktiv_siste_tre_ferdigliknede_arene:
            harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene && virksomhet.oppstartsdato
                ? {
                      oppstartsdato: formatDateToApiFormat(virksomhet.oppstartsdato)
                  }
                : undefined,
        har_regnskapsforer: harRegnskapsfører,
        regnskapsforer: harRegnskapsfører
            ? {
                  navn: virksomhet.regnskapsfører_navn!,
                  telefon: virksomhet.regnskapsfører_telefon!,
                  er_nar_venn_familie: virksomhet.regnskapsfører_erNærVennEllerFamilie === YesOrNo.YES
              }
            : undefined,
        har_revisor: harRevisor,
        revisor: harRevisor
            ? {
                  navn: virksomhet.revisor_navn!,
                  telefon: virksomhet.revisor_telefon!,
                  er_nar_venn_familie: virksomhet.revisor_erNærVennEllerFamilie === YesOrNo.YES,
                  kan_innhente_opplysninger:
                      virksomhet.revisor_erNærVennEllerFamilie === YesOrNo.YES
                          ? virksomhet.kanInnhenteOpplsyningerFraRevisor === YesOrNo.YES
                          : undefined
              }
            : undefined
    };

    return data;
};
