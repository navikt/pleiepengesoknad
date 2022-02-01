/** Toggle fortid/fremtid */
export const useFortidFremtid = 1 + 1 === 2;

export enum TimerEllerProsent {
    PROSENT = 'prosent',
    TIMER = 'timer',
}

export enum BarnRelasjon {
    MOR = 'MOR',
    FAR = 'FAR',
    MEDMOR = 'MEDMOR',
    FOSTERFORELDER = 'FOSTERFORELDER',
    ANNET = 'ANNET',
}

export enum JobberIPeriodeSvar {
    JA = 'JA',
    NEI = 'NEI',
}

export enum AndreYtelserFraNAV {
    'dagpenger' = 'dagpenger',
    'foreldrepenger' = 'foreldrepenger',
    'svangerskapspenger' = 'svangerskapspenger',
    'sykepenger' = 'sykepenger',
    'omsorgspenger' = 'omsorgspenger',
    'opplæringspenger' = 'opplæringspenger',
}

export enum ÅrsakManglerIdentitetsnummer {
    'NYFØDT' = 'NYFØDT',
    'BARNET_BOR_I_UTLANDET' = 'BARNET_BOR_I_UTLANDET',
    'ANNET' = 'ANNET',
}
